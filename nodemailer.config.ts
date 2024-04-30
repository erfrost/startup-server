const nodemailer = require('nodemailer');

const nodemailerInstance = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'artenkanoobas@gmail.com',
    pass: 'pqjy nqiz ykjm vxqb',
  },
});

export default nodemailerInstance;
