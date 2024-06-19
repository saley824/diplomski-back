import argon2 from "argon2";
import crypto from "crypto";
import nodemailer from "nodemailer";

interface Options {
  email: string;
  subject: string;
  message: string;
}

// ----------------------------EMAIL SENDING-----------------------------------
const sendEmail = async (options: Options) => {
  const emailUsername: string = process.env.EMAIL_USERNAME!;
  const emailPassword = process.env.EMAIL_PASSWORD!;
  const emailHost = process.env.EMAIL_HOST!;
  const emailPort = process.env.EMAIL_PORT!;

  console.log(emailUsername);
  console.log(emailPassword);
  console.log(emailHost);
  console.log(emailPort);
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: parseInt(emailPort),
    auth: {
      user: emailUsername,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: "Mr Obradovic",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

// ----------------------------CREATE HASH PASSWORD-----------------------------------
const hashPassword = async (password: string) => {
  return await argon2.hash(password);
};

// ----------------------------VERIFY PASSWORD-----------------------------------
const compare = async (password: string, candidate: string) => {
  return await argon2.verify(password, candidate);
};

// ----------------------------CREATE PASSWORD TOKEN-----------------------------------
const createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(3).toString("hex");

  const hashResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const now = new Date();
  const tokenExpires = new Date(now.getTime() + 10 * 60000);

  return { resetToken, hashResetToken, tokenExpires };
};

export default {
  hashPassword,
  compare,
  createPasswordResetToken,
  sendEmail,
};
