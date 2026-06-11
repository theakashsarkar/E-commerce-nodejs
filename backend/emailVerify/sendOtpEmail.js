import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOtpMail = async (otp, email) => {
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
    subject: "password reset otp",
    html: `<p>Your OTP for password reset is : <b>${otp}</b></p>`,
  };
  transporter.sendMail(mailConfigurations, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("otp sent: " + info.response);
    }
  });
};
