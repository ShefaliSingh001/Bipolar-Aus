import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { norm, overlap, availabilityDays } from '../../shared/matching.ts';

// Fast local semantic proxy: weighted token overlap between the resume/profile text
// and the role text. Avoids an extra LLM round-trip for every role.
function semanticProxy(volunteer, profile, role) {
  const tokens = (t) => new Set(norm(t).split(/[^a-z0-9+]+/).filter((w) => w.length > 3));
  const vText = [profile.resume_text, (profile.skills || []).join(' '), (volunteer.skills || []).join(' '), (profile.interests || []).join(' ')].join(' ');
  const v = tokens(vText);
  const r = tokens(role.title + ' ' + (role.description || '') + ' ' + (role.required_skills || []).join(' '));
  if (!r.size) return 40;
  let hits = 0;
  r.forEach((w) => { if (v.has(w)) hits += 1; });
  return Math.round(Math.min(1, (hits / r.size) * 1.4) * 100);
}

function category(score) {
  if (score >= 85) return 'strong';
  if (score >= 70) return 'good';
  if (score >= 50) return 'moderate';
  return 'weak';
}

// Deterministic hybrid score. Semantic component comes from the LLM (0-100) but is
// combined with fixed weights so the same inputs always produce the same ranking.
function scoreRole(volunteer, profile, role, semantic) {
  const vSkills = [...(volunteer.skills || []), ...(profile.skills || [])];
  const skills_score = Math.round(overlap(role.required_skills, vSkills) * 100);

  const years = Number(profile.experience_years || 0);
  const experience_score = Math.round(Math.min(1, years / 3) * 100);

  const timings = norm(role.timings);
  const vDays = availabilityDays(volunteer);
  const dayHit = timings.includes('flexible') || norm(volunteer.availability) === 'flexible' || vDays.some((d) => d && timings.includes(d));
  const weekly = Number(volunteer.total_weekly_hours || 0);
  const hoursOk = !role.hours_required || (weekly && weekly >= role.hours_required);
  const availability_score = (dayHit ? 60 : 20) + (hoursOk ? 40 : 0);

  const roleText = norm(role.title + ' ' + (role.description || ''));
  const vLoc = [...(profile.locations || []), volunteer.timezone || ''];
  const location_score = vLoc.some((l) => l && roleText.includes(norm(l))) ? 100 : 70;

  const interests_score = Math.round(overlap(profile.interests, [role.title, role.description, ...(role.required_skills || [])]) * 100);
  const qualifications_score = Math.round(overlap(profile.qualifications, [role.description, ...(role.required_skills || [])]) * 100);

  const semantic_score = Math.max(0, Math.min(100, Math.round(semantic || 0)));

  const overall = Math.round(
    skills_score * 0.3 +
    semantic_score * 0.25 +
    experience_score * 0.12 +
    availability_score * 0.13 +
    location_score * 0.05 +
    interests_score * 0.08 +
    qualifications_score * 0.07
  );

  return {
    job_role_id: role.id,
    job_role_title: role.title,
    overall_match_score: Math.max(0, Math.min(100, overall)),
    match_category: category(overall),
    skills_score,
    semantic_score,
    experience_score,
    availability_score,
    location_score,
    interests_score,
    qualifications_score,
  };
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const volunteerId = body.volunteer_id;
    if (!volunteerId) return Response.json({ error: 'volunteer_id is required' }, { status: 400 });

    const volunteer = await base44.asServiceRole.entities.Volunteer.get(volunteerId);
    if (!volunteer) return Response.json({ error: 'Volunteer not found' }, { status: 404 });

    const roles = (await base44.asServiceRole.entities.JobRole.filter({ status: 'open' })).slice(0, 40);
    if (!roles.length) return Response.json({ matches: [], note: 'No open roles' });

    // 1. Resume -> structured profile (only what is actually in the resume).
    let profile = { skills: [], qualifications: [], interests: [], locations: [], experience_years: 0, resume_text: '' };
    if (volunteer.resume) {
      const extracted = await base44.asServiceRole.integrations.Core.ExtractDataFromUploadedFile({
        file_url: volunteer.resume,
        json_schema: {
          type: 'object',
          properties: {
            resume_text: { type: 'string' },
            skills: { type: 'array', items: { type: 'string' } },
            qualifications: { type: 'array', items: { type: 'string' } },
            interests: { type: 'array', items: { type: 'string' } },
            locations: { type: 'array', items: { type: 'string' } },
            experience_years: { type: 'number' },
          },
        },
      });
      if (extracted && extracted.status === 'success' && extracted.output) {
        const out = Array.isArray(extracted.output) ? extracted.output[0] : extracted.output;
        profile = { ...profile, ...(out || {}) };
      }
    }

    // 2 + 3. Score every role locally (no LLM round-trip), rank, take top 3.
    const ranked = roles
      .map((r) => scoreRole(volunteer, profile, r, semanticProxy(volunteer, profile, r)))
      .sort((a, b) => b.overall_match_score - a.overall_match_score);
    const top3 = ranked.slice(0, 3).map((m, i) => ({ ...m, rank: i + 1 }));

    // 4. RAG-grounded explanations for the top 3 only.
    let explanations = {};
    try {
      const exp = await base44.asServiceRole.integrations.Core.InvokeLLM({
        model: 'gemini_3_flash',
        prompt:
          'You explain volunteer-role matches to an administrator. Use ONLY the resume content below as evidence. ' +
          'If a role requirement is not evidenced in the resume, list it under missing_requirements and state it was "not identified in the resume". Never invent experience, skills, qualifications or achievements.\n\n' +
          'Resume content: ' + String(profile.resume_text || '(no resume text available)').slice(0, 6000) + '\n' +
          'Stated volunteer skills: ' + JSON.stringify(volunteer.skills || []) + '\n' +
          'Availability: ' + JSON.stringify({ availability: volunteer.availability, slots: volunteer.availability_slots, weekly_hours: volunteer.total_weekly_hours }) + '\n\n' +
          'Roles to explain: ' + JSON.stringify(top3.map((m) => {
            const r = roles.find((x) => x.id === m.job_role_id);
            return { role_id: m.job_role_id, title: r.title, description: r.description, required_skills: r.required_skills, hours_required: r.hours_required, timings: r.timings, computed_scores: m };
          })),
        response_json_schema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role_id: { type: 'string' },
                  ai_explanation: { type: 'string' },
                  supporting_evidence: { type: 'array', items: { type: 'string' } },
                  missing_requirements: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
      });
      ((exp && exp.items) || []).forEach((i) => { explanations[i.role_id] = i; });
    } catch (_e) {
      explanations = {};
    }

    // 5. Replace the previous undecided cycle, keep decided records for audit.
    await base44.asServiceRole.entities.VolunteerJobMatch.deleteMany({ volunteer_id: volunteerId, recommendation_status: 'recommended' });

    const now = new Date().toISOString();
    const records = top3.map((m) => {
      const e = explanations[m.job_role_id] || {};
      return {
        ...m,
        volunteer_id: volunteerId,
        volunteer_name: volunteer.name,
        volunteer_email: volunteer.email_id,
        ai_explanation: e.ai_explanation || 'Ranked by the deterministic match score; no grounded explanation could be generated.',
        supporting_evidence: e.supporting_evidence || [],
        missing_requirements: e.missing_requirements || [],
        recommendation_status: 'recommended',
        cycle_generated_at: now,
      };
    });
    const created = await base44.asServiceRole.entities.VolunteerJobMatch.bulkCreate(records);

    return Response.json({ matches: created, evaluated: ranked.length, had_resume: !!volunteer.resume });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}