

const nodemailer = require('nodemailer');

const sendEmail = (req, res) => {
  const { email, formData } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });


  const mailOptions = {
    from: '',
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


  };

module.exports = {
  sendEmail
};
