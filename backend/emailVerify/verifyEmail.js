import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = (token, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // const mailConfigurations = {
  //   from: process.env.EMAIL_USERNAME,
  //   to: email,
  //   subject: "email verification",
  //   text: `Click the link below to verify your email: ${process.env.FRONTEND_URL}/verify-email/${token}`,
  // };
  const mailConfigurations = {
    from: `"Your App Name" <${process.env.EMAIL_USERNAME}>`, // Professional sender formatting
    to: email,
    subject: "Verify Your Email Address",
    // 3. Provide both Text and HTML alternatives for modern email clients
    text: `Welcome! Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/verify-email/${token}`,
    html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a;">Welcome to Our Platform!</h2>
            <p style="color: #334155; line-height: 1.5;">Thank you for signing up. Please click the button below to verify your email address and activate your account.</p>
            <div style="margin: 24px 0;">
              <a href="${process.env.FRONTEND_URL}/verify-email/${token}"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #64748b; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:<br>
            ${process.env.FRONTEND_URL}/verify-email/${token}</p>
          </div>
        `,
  };
  transporter.sendMail(mailConfigurations, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
