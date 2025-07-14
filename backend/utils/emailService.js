import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

export const sendResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

const testEmailConfig = async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to send emails");
    }
  });
};
