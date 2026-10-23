import nodemailer from "nodemailer";

interface SendOtpParams {
  toEmail: string;
  otp: string;
  firstName?: string;
}

/**
 * Returns a nodemailer transporter using Google App Password or custom SMTP.
 */
function getTransporter() {
  const user =
    process.env.EMAIL_SERVER_USER ||
    process.env.SMTP_USER ||
    process.env.GMAIL_USER;

  const pass =
    process.env.EMAIL_SERVER_PASSWORD ||
    process.env.SMTP_PASS ||
    process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    }),
    user,
  };
}

/**
 * Sends a 6-digit password reset OTP email using nodemailer.
 */
export async function sendPasswordResetOtpEmail({
  toEmail,
  otp,
  firstName,
}: SendOtpParams): Promise<{ success: boolean; message?: string }> {
  const mailConfig = getTransporter();

  // If email credentials are not set, log to console in dev mode
  if (!mailConfig) {
    console.log(
      `\n=======================================================\n` +
      `[DEV EMAIL SIMULATION] Password Reset Requested\n` +
      `To: ${toEmail}\n` +
      `OTP Code: ${otp}\n` +
      `Expires In: 10 minutes\n` +
      `Note: Set GMAIL_USER & GMAIL_APP_PASSWORD in .env.local to send real emails.\n` +
      `=======================================================\n`
    );
    return { success: true };
  }

  const { transporter, user } = mailConfig;
  const fromAddress =
    process.env.EMAIL_FROM || `"SriRam Garments" <${user}>`;

  const greeting = firstName ? `Hello ${firstName},` : "Hello,";

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your SriRam Garments Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e4e4e7; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #111111; padding: 28px 32px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: 0.5px;">
                SriRam <span style="color: #f97316;">Garments</span>
              </h1>
              <p style="color: #a1a1aa; font-size: 11px; margin: 6px 0 0; text-transform: uppercase; letter-spacing: 1px;">Quality Garments For Every You</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="color: #18181b; font-size: 20px; font-weight: 700; margin: 0 0 14px;">Password Reset Code</h2>
              <p style="color: #52525b; font-size: 14px; line-height: 22px; margin: 0 0 20px;">
                ${greeting} We received a request to reset the password for your SriRam Garments account. Use the verification code below to complete the reset:
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #fff7ed; border: 1.5px dashed #f97316; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <p style="color: #9a3412; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 8px;">Your Verification Code</p>
                <div style="color: #ea580c; font-size: 36px; font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace; margin: 0;">
                  ${otp}
                </div>
              </div>

              <p style="color: #71717a; font-size: 12px; line-height: 18px; margin: 0 0 16px;">
                ⏳ <strong>This code will expire in 10 minutes.</strong> For your security, do not share this code with anyone.
              </p>
              <p style="color: #a1a1aa; font-size: 12px; line-height: 18px; margin: 0;">
                If you did not request this password reset, please ignore this email or contact support. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f4f4f5; padding: 20px 32px; text-align: center;">
              <p style="color: #a1a1aa; font-size: 11px; margin: 0;">
                © 2026 SriRam Garments. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `Your SriRam Garments Password Reset Code: ${otp}`,
      text: `Your SriRam Garments password reset code is: ${otp}\n\nThis code expires in 10 minutes.\nIf you did not request a password reset, please ignore this message.`,
      html: htmlContent,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Nodemailer error:", error);
    return {
      success: false,
      message: error?.message || "Failed to send email. Please try again later.",
    };
  }
}
