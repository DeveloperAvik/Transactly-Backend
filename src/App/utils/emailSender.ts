import nodemailer from "nodemailer";
import { envVars } from "../config/env";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: envVars.emailService,
    auth: {
      user: envVars.emailUser,
      pass: envVars.emailPass,
    },
  });

  await transporter.sendMail({
    from: `"Transactly" <${envVars.emailUser}>`,
    to,
    subject,
    html,
  });
};
