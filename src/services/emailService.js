const nodemailer = require("nodemailer");

/**
 * Singleton transporter — reused across invocations to avoid repeated TLS handshakes.
 */
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true", // true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return _transporter;
}

/**
 * Send a password-reset email with a signed link.
 *
 * @param {string} toEmail       - Recipient address
 * @param {string} resetToken    - Plain-text token (not hashed)
 * @param {string} frontendOrigin - Base URL of the frontend (e.g. http://localhost:3000 or https://patterson-chenny-crm.vercel.app)
 */
async function sendPasswordResetEmail(toEmail, resetToken, frontendOrigin) {
  const baseUrl = (frontendOrigin || process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(toEmail)}`;

  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"OmniSuiteAI" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Reset Your OmniSuiteAI Password",
    text: `You requested a password reset for your OmniSuiteAI account.\n\nClick the link below to reset your password (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, please ignore this email — your password will not change.\n\nThanks,\nThe Patterson Cheney Automotive Group Team`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background:#060D1A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#060D1A;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#0F1A2E;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0C1E3C,#0096C7);padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.15);margin-bottom:16px;">
                <span style="font-size:22px;">⚡</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                OmniSuiteAI
              </h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.65);font-size:13px;">
                Patterson Cheney Automotive Group
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 8px;color:#ffffff;font-size:20px;font-weight:600;">
                Reset Your Password
              </h2>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
                We received a request to reset the password for your account
                associated with <strong style="color:#e2e8f0;">${toEmail}</strong>.
                Click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="border-radius:10px;background:#00B4D8;box-shadow:0 4px 20px rgba(0,180,216,0.35);">
                    <a href="${resetUrl}"
                       style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:10px;letter-spacing:0.2px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 8px;color:#64748b;font-size:12px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 28px;word-break:break-all;">
                <a href="${resetUrl}" style="color:#00B4D8;font-size:12px;">${resetUrl}</a>
              </p>

              <!-- Warning box -->
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;">
                <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
                  ⏱ This link expires in <strong style="color:#94a3b8;">1 hour</strong>.<br/>
                  🔒 If you didn't request a password reset, you can safely ignore this email.
                  Your password will not change.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0;color:#475569;font-size:11px;line-height:1.6;">
                © ${new Date().getFullYear()} Patterson Cheney Automotive Group · All rights reserved.<br/>
                This email was sent to ${toEmail} because a password reset was requested.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email] Password reset sent to ${toEmail} — messageId: ${info.messageId}`);
  return info;
}

module.exports = { sendPasswordResetEmail };
