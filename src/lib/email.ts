import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = "DIY1T <hello@diy1t.com>";
const BASE_URL = "https://www.diy1t.com";

function layout(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DIY1T</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:24px 32px;border-radius:12px 12px 0 0;">
            <a href="${BASE_URL}" style="text-decoration:none;">
              <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">DIY<span style="color:#f97316;">1T</span></span>
            </a>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 32px;border-radius:0 0 12px 12px;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              © ${new Date().getFullYear()} DIY1T &nbsp;·&nbsp;
              <a href="${BASE_URL}/terms" style="color:#94a3b8;">Terms</a> &nbsp;·&nbsp;
              <a href="${BASE_URL}/privacy" style="color:#94a3b8;">Privacy</a> &nbsp;·&nbsp;
              <a href="${BASE_URL}/returns" style="color:#94a3b8;">Returns</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(text: string, href: string) {
  return `<a href="${href}" style="display:inline-block;padding:12px 28px;background:#f97316;color:#ffffff;font-weight:700;font-size:15px;border-radius:8px;text-decoration:none;">${text}</a>`;
}

// ── Welcome email ──────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, firstName: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Welcome to DIY1T — let's build something great 🛠️",
    html: layout(`
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0f172a;">Welcome, ${firstName}! 👋</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
        You've just joined thousands of makers who are saving money and building things they're proud of.
        Upload a photo of anything — a dog harness, a pet bed, a sweater — and we'll generate a complete
        step-by-step DIY build plan just for you.
      </p>
      <p style="margin:0 0 28px;font-size:15px;color:#475569;">Ready to make your first project?</p>
      ${btn("Start Building", `${BASE_URL}/dashboard/upload`)}
      <hr style="margin:36px 0;border:none;border-top:1px solid #f1f5f9;" />
      <p style="margin:0;font-size:13px;color:#94a3b8;">
        Questions? Reply to this email and we'll help you get started.
      </p>
    `),
  });
}

// ── Project complete email ─────────────────────────────────────────────────────
export async function sendProjectCompleteEmail(
  to: string,
  firstName: string,
  projectTitle: string,
  projectId: string,
  estimatedCostCents: number,
  moneySavedCents: number
) {
  const cost = (estimatedCostCents / 100).toFixed(2);
  const saved = (moneySavedCents / 100).toFixed(2);
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Your DIY plan is ready: ${projectTitle}`,
    html: layout(`
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0f172a;">Your plan is ready! 🎉</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
        We've generated a complete build guide for <strong>${projectTitle}</strong>.
        Materials, cut patterns, step-by-step instructions — everything you need.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:28px;">
        <tr>
          <td style="text-align:center;padding:8px 16px;border-right:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Estimated Cost</p>
            <p style="margin:4px 0 0;font-size:22px;font-weight:800;color:#0f172a;">$${cost}</p>
          </td>
          <td style="text-align:center;padding:8px 16px;">
            <p style="margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">You Save</p>
            <p style="margin:4px 0 0;font-size:22px;font-weight:800;color:#16a34a;">$${saved}</p>
          </td>
        </tr>
      </table>
      ${btn("View Full Plan", `${BASE_URL}/dashboard/projects/${projectId}`)}
      <hr style="margin:36px 0;border:none;border-top:1px solid #f1f5f9;" />
      <p style="margin:0;font-size:13px;color:#94a3b8;">
        You can also download a PDF of the full build guide from the project page.
      </p>
    `),
  });
}

// ── Payment receipt email ──────────────────────────────────────────────────────
export async function sendReceiptEmail(
  to: string,
  firstName: string,
  planName: string,
  amountCents: number,
  invoiceId: string,
  date: Date
) {
  const amount = (amountCents / 100).toFixed(2);
  const dateStr = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Your DIY1T receipt — $${amount}`,
    html: layout(`
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0f172a;">Payment confirmed ✅</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#475569;">Thanks ${firstName}, here's your receipt.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:28px;">
        <tr style="background:#f8fafc;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;">Description</td>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;text-align:right;">Amount</td>
        </tr>
        <tr>
          <td style="padding:14px 16px;font-size:14px;color:#0f172a;">${planName}</td>
          <td style="padding:14px 16px;font-size:14px;color:#0f172a;text-align:right;">$${amount}</td>
        </tr>
        <tr style="background:#f8fafc;border-top:1px solid #e2e8f0;">
          <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f172a;">Total</td>
          <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f172a;text-align:right;">$${amount}</td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="font-size:13px;color:#64748b;padding:4px 0;">Date</td>
          <td style="font-size:13px;color:#0f172a;text-align:right;padding:4px 0;">${dateStr}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#64748b;padding:4px 0;">Invoice ID</td>
          <td style="font-size:13px;color:#0f172a;text-align:right;padding:4px 0;">${invoiceId}</td>
        </tr>
      </table>
      ${btn("Go to Dashboard", `${BASE_URL}/dashboard`)}
      <hr style="margin:36px 0;border:none;border-top:1px solid #f1f5f9;" />
      <p style="margin:0;font-size:13px;color:#94a3b8;">
        Questions about your bill? Reply to this email or visit our
        <a href="${BASE_URL}/returns" style="color:#64748b;">return policy</a>.
      </p>
    `),
  });
}

// ── Thank-you email (after first project) ─────────────────────────────────────
export async function sendThankYouEmail(to: string, firstName: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Thanks for building with DIY1T 🙏",
    html: layout(`
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0f172a;">You're officially a maker 🛠️</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
        Thanks ${firstName} for building with DIY1T! We hope your project turns out exactly how you imagined.
        Share a photo of your finished build — we'd love to feature it in our community gallery.
      </p>
      <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
        Ready to build another one? Upload a new photo anytime and we'll generate a fresh plan in seconds.
      </p>
      ${btn("Build Another Project", `${BASE_URL}/dashboard/upload`)}
      <hr style="margin:36px 0;border:none;border-top:1px solid #f1f5f9;" />
      <p style="margin:0;font-size:13px;color:#94a3b8;">
        Leave us a review — your feedback helps us improve for every maker out there.
      </p>
    `),
  });
}
