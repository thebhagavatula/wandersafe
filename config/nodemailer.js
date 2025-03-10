import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
//   secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Connection Successful!"); //Simple Mail Transfer Protocol
  }
});

export default transporter;