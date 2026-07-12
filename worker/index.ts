/// <reference types="@cloudflare/workers-types" />

export interface Env {
  RESEND_API_KEY: string;
  ASSETS: Fetcher;
}

// TEMPORARY: onboarding@resend.dev can only deliver to the Resend account's own
// signup address until columbiacountydems.org is verified as a sending domain
// (blocked on DNS access — see TASKS.md). Restore these once verified:
//   const TO_EMAILS = ['info@columbiademocrats.org'];
//   const CC_EMAILS = ['groseclosea31@yahoo.com'];
const TO_EMAILS = ['randy@convergent.consulting'];
const CC_EMAILS: string[] = [];
const FROM_EMAIL = 'Columbia County Democrats <onboarding@resend.dev>';

const INTEREST_LABELS: Record<string, string> = {
  canvassing: 'Canvassing / door-knocking',
  phonebanking: 'Phone banking',
  events: 'Event support',
  'yard-sign': 'Host a yard sign',
  skills: 'Donate a professional skill',
  other: 'Something else',
};

function isSpam(form: FormData): boolean {
  return Boolean(form.get('_gotcha'));
}

function field(form: FormData, name: string): string {
  return form.get(name)?.toString().trim() ?? '';
}

async function sendEmail(env: Env, subject: string, lines: string[], replyTo?: string): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TO_EMAILS,
      cc: CC_EMAILS.length > 0 ? CC_EMAILS : undefined,
      subject,
      text: lines.join('\n'),
      reply_to: replyTo || undefined,
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
  }
  return res.ok;
}

function jsonResponse(ok: boolean): Response {
  return new Response(JSON.stringify({ ok }), {
    status: ok ? 200 : 502,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  if (isSpam(form)) return jsonResponse(true);

  const firstName = field(form, 'first-name');
  const lastName = field(form, 'last-name');
  const email = field(form, 'email');
  const message = field(form, 'message');

  const ok = await sendEmail(
    env,
    `Contact form: ${firstName} ${lastName}`,
    [`Name: ${firstName} ${lastName}`, `Email: ${email}`, '', message],
    email
  );
  return jsonResponse(ok);
}

async function handleVolunteer(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  if (isSpam(form)) return jsonResponse(true);

  const name = field(form, 'name');
  const email = field(form, 'email');
  const phone = field(form, 'phone');
  const interest = INTEREST_LABELS[field(form, 'interest')] ?? field(form, 'interest');
  const message = field(form, 'message');

  const ok = await sendEmail(
    env,
    `Volunteer sign-up: ${name}`,
    [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || '(not provided)'}`,
      `Interested in: ${interest}`,
      '',
      message,
    ],
    email
  );
  return jsonResponse(ok);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method === 'POST' && pathname === '/api/contact') {
      return handleContact(request, env);
    }
    if (request.method === 'POST' && pathname === '/api/volunteer') {
      return handleVolunteer(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
