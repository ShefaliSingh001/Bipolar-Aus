import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { createMimeMessage } from 'npm:mimetext@3.0.24';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { application_id } = await req.json();
    if (!application_id) return Response.json({ error: 'application_id is required' }, { status: 400 });

    const app = await base44.asServiceRole.entities.Application.get(application_id);
    if (!app) return Response.json({ error: 'Application not found' }, { status: 404 });
    if (!app.volunteer_email) return Response.json({ error: 'Volunteer has no email address' }, { status: 400 });

    let role = null;
    if (app.role_id) {
      try { role = await base44.asServiceRole.entities.JobRole.get(app.role_id); } catch (_e) { role = null; }
    }

    let volunteer = null;
    if (app.volunteer_id) {
      try { volunteer = await base44.asServiceRole.entities.Volunteer.get(app.volunteer_id); } catch (_e) { volunteer = null; }
    }

    const slots = (volunteer?.availability_slots || [])
      .map((s) => `${s.day || ''} ${s.start_time || ''}–${s.end_time || ''}`.trim())
      .filter(Boolean);

    const lines = [
      `Hi ${app.volunteer_name || 'there'},`,
      '',
      `Great news — your application to volunteer with Bipolar Australia has been approved for the role of ${app.role_title || role?.title || 'volunteer'}.`,
      '',
      'Your shift details:',
      `• Role: ${app.role_title || role?.title || '—'}`,
      `• Shift timings: ${role?.timings || volunteer?.available_time || 'To be confirmed with your coordinator'}`,
      `• Hours per week: ${app.hours_required || role?.hours_required || '—'}`,
      `• Your availability: ${slots.length ? slots.join(', ') : (volunteer?.availability || '—')}`,
      `• Preferred area: ${app.preferred_area || '—'}`,
      '',
      role?.description ? `About the role: ${role.description}` : '',
      '',
      'Please reply to this email to confirm your first shift. We look forward to working with you.',
      '',
      'Warm regards,',
      'Bipolar Australia Volunteer Team',
    ].filter((l) => l !== undefined);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const msg = createMimeMessage();
    msg.setSender({ name: 'Bipolar Australia Volunteer Team', addr: user.email });
    msg.setRecipient(app.volunteer_email);
    msg.setSubject(`Your volunteer shift is approved — ${app.role_title || role?.title || 'Bipolar Australia'}`);
    msg.addMessage({ contentType: 'text/plain', data: lines.join('\n') });

    const bytes = new TextEncoder().encode(msg.asRaw());
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    const raw = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return Response.json({ error: 'Gmail send failed', detail }, { status: 502 });
    }

    return Response.json({ sent: true, to: app.volunteer_email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}