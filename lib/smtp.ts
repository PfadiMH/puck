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

  const res = transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
