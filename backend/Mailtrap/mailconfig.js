const { MailtrapClient } = require("mailtrap");
require('dotenv').config();

const MailClient = new MailtrapClient({ token : process.env.M_TOKEN });

const sender = {
  email: "hello@demomailtrap.com",
  name: "Akshat",
};

module.exports = {
  sender,
  MailClient
};