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

  const mailConfigurations = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "email verification",
    text: `Click the link below to verify your email: ${process.env.FRONTEND_URL}/verify-email/${token}`,
  };
  transporter.sendMail(mailConfigurations, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
