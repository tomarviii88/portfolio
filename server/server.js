const express = require('express');
const nodemailer = require('nodemailer');
const creds = require('./credentials');
const app = express();

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(express.json({ extended: false }));
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', ['*']);
  next();
});

var transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

app.post('/send', (req, res, next) => {
  const { name, email, message } = req.body;
  const content = `Name: ${name} Email: ${email} Message: ${message}`;

  let mail = {
    from: name,
    to: 'tomarviii88@gmail.com',
    subject: 'New Message from Contact Form',
    text: content
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({ msg: 'fail' });
    } else {
      res.json({ msg: 'success' });
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
});
