const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendInvitationEmail(to, chatLink) {
  const mailOptions = {
    from: `"Support Team Профи Консалт" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Приглашение в чат поддержки',
    html: `
      <p>Здравствуйте!</p>
      <p>Благодарим вас за обращение. Нажмите кнопку ниже, чтобы перейти в чат:</p>
      <p>
        <a href="${chatLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;" target="_blank">
          Открыть чат
        </a>
      </p>
      <p>Это приватный чат, созданный специально для вашего запроса.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendInvitationEmail };
