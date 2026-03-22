import nodemailer from "nodemailer";

const buildTransport = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP credentials are not configured");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const transporter = buildTransport();

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
};
