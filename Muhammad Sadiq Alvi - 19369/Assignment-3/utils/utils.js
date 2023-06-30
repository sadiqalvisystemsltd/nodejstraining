/* eslint linebreak-style: ["error", "windows"] */
const nodemailer =    require('nodemailer');

const getReturnableUserObject = (user) => {
  const userCopy = { ...user };
  delete userCopy.password;
  return userCopy;
};

const sendMail = (user, checkoutObj) => {
  console.log(`Sending Email to : ${user.email}`);
  const senderEmail = process.env.TEST_EMAIL;
  const senderPassword = process.env.TEST_EMAIL_PASSWORD;
  console.log(`Sender details: ${senderEmail}, ${senderPassword}`);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });
  const mailOptions = {
    from: process.env.TEST_EMAIL,
    to: user.email,
    subject: 'NodeJS Training Checkout',
    text: `Checkout Details: ${JSON.stringify(checkoutObj)}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

exports.getReturnableUserObject = getReturnableUserObject;
exports.sendMail = sendMail;
