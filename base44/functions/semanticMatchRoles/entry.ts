import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

function norm(s) {
  return String(s || '').toLowerCase().trim();
}

function ruleBased(volunteer, roles) {
  const vSkills = (volunteer.skills || []).map(norm);
  const vDays = (volunteer.availability_slots || []).map((s) => norm(s.day));
  return roles
    .map((role) => {
      const req = (role.required_skills || []).map(norm);
      const matched = req.filter((r) => vSkills.some((v) => v.includes(r) || r.includes(v)));
      let score = req.length ? (matched.length / req.length) * 80 : 40;
      const timings = norm(role.timings);
      const dayHit = vDays.some((d) => d && timings.includes(d)) || timings.includes('flexible');
      if (dayHit) score += 20;
      const weekly = Number(volunteer.total_weekly_hours || 0);
      if (role.hours_required && weekly && weekly >= role.hours_required) score += 5;
      return {
        role_id: role.id,
        role_title: role.title,
        timings: role.timings || '',
        hours_required: role.hours_required || 0,
        matched_skills: (role.required_skills || []).filter((r) => vSkills.some((v) => norm(r).includes(v) || v.includes(norm(r)))),
        availability_fit: dayHit,
        score: Math.min(100, Math.round(score)),
        reason: matched.length
          ? 'Shares ' + matched.length + ' of the skills this role needs' + (dayHit ? ' and fits your availability' : '')
          : 'Open role that could suit your availability'
      };
    })
    .sort((a, b) => b.score - a.score);
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const volunteer = body.volunteer || {};

    const allRoles = await base44.asServiceRole.entities.JobRole.filter({ status: 'open' });
    const roles = (allRoles || []).slice(0, 40);
    if (!roles.length) return Response.json({ matches: [], source: 'none' });

    const fallback = ruleBased(volunteer, roles);

    try {
      const prompt =
        'You match volunteers to volunteer roles for a mental health charity.\n' +
        'Volunteer skills: ' + JSON.stringify(volunteer.skills || []) + '\n' +
        'Volunteer availability slots: ' + JSON.stringify(volunteer.availability_slots || []) + '\n' +
        'Volunteer timezone: ' + (volunteer.timezone || 'Australia/Sydney') + '\n' +
        'Weekly hours available: ' + (volunteer.total_weekly_hours || 0) + '\n\n' +
        'Open roles: ' + JSON.stringify(roles.map((r) => ({ id: r.id, title: r.title, description: r.description, required_skills: r.required_skills, hours_required: r.hours_required, timings: r.timings }))) + '\n\n' +
        'Rank roles by semantic skill similarity plus availability/timezone overlap. Score 0-100. Only include roles with a plausible fit. Give a one-sentence human reason for each.';

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            matches: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role_id: { type: 'string' },
                  score: { type: 'number' },
                  matched_skills: { type: 'array', items: { type: 'string' } },
                  availability_fit: { type: 'boolean' },
                  reason: { type: 'string' }
                }
              }
            }
          }
        }
      });

      const raw = (result && result.matches) || [];
      const byId = {};
      roles.forEach((r) => { byId[r.id] = r; });
      const matches = raw
        .filter((m) => byId[m.role_id])
        .map((m) => ({
          role_id: m.role_id,
          role_title: byId[m.role_id].title,
          timings: byId[m.role_id].timings || '',
          hours_required: byId[m.role_id].hours_required || 0,
          matched_skills: m.matched_skills || [],
          availability_fit: !!m.availability_fit,
          score: Math.max(0, Math.min(100, Math.round(m.score || 0))),
          reason: m.reason || ''
        }))
        .sort((a, b) => b.score - a.score);

      if (matches.length) return Response.json({ matches, source: 'semantic' });
      return Response.json({ matches: fallback, source: 'rules' });
    } catch (llmError) {
      return Response.json({ matches: fallback, source: 'rules', note: llmError.message });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}