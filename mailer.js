const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_PASS);  // Your SendGrid API key from env

async function sendEmail(mailOptions) {
  const msg = {
    to: mailOptions.to,
    from: mailOptions.from,  // Must be verified sender in SendGrid
    subject: mailOptions.subject,
    text: mailOptions.text,
  };
  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('SendGrid email error:', error);
    throw error;
  }
}

module.exports = sendEmail;
