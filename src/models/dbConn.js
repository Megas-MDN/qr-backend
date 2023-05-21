const mogoose = require('mongoose');
require('dotenv/config');

module.exports = async () => {
  const password = process.env.PASS_DB;
  const userDB = process.env.USER_DB;
  const url = `mongodb+srv://${userDB}:${password}@cluster0.57anb63.mongodb.net/qr-code-gen?retryWrites=true&w=majority`;
  try {
    await mogoose.connect(url);
    console.log('Successfully connected to the database!');
  } catch (error) {
    console.log('Failed to connect to database');
    throw error;
  }
};
