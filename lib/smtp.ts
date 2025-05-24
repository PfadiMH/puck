import nodemailer from "nodemailer";

export const sendMail = async (
  to: string,
  subject: string,
  content: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "587"),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.BREVO_KEY,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html: content,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log("Error sending email: " + error);
  }
};
