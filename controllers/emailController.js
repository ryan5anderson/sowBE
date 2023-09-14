

const nodemailer = require('nodemailer');

const sendEmail = (req, res) => {
  const { email, formData } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'anderson.t.ryan@gmail.com',
      pass: 'gqcl qroo dgfj nsye'
    }
  });


  const mailOptions = {
    from: 'anderson.t.ryan@gmail.com',
    to: email,
    subject: 'Form Data',
    text: JSON.stringify(formData)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });

  /*
  
  const mailOptions = {
    from: 'anderson.t.ryan@gmail.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'This is a test email.'
  };

  */

  };

module.exports = {
  sendEmail
};
