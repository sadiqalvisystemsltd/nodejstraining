/* eslint linebreak-style: ["error", "windows"] */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DB_CONNECTION_URI = 'mongodb+srv://msadiqalvivisionet:wQRFbA2iRtSKWrgg@cluster0.zdn9lwe.mongodb.net/';

const connectDB = async () => {
  console.log('Connecting to database');
  await mongoose.connect(DB_CONNECTION_URI).then((res) => {
    console.log(`DB Connected to: ${DB_CONNECTION_URI}`, res);
  }).catch((err) => {
    console.log('Unable to connect to Database: ', err);
  });
};

const { Schema } = mongoose;
const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String,
  password: String,
  email: String,
});

const addUser = async (username, password, email, firstName, lastName) => {
  const User = mongoose.model('User', UserSchema);
  const newUser = new User({
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    username,
  });
  await newUser.save();
};

const getUser = async (username, password) => {
  const User = mongoose.model('User', UserSchema);
  const user = await User.findOne({ username }).lean();
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;
};

const getUserByUsername = async (username) => {
  const User = mongoose.model('User', UserSchema);
  const user = await User.findOne({ username }).lean();
  return user;
};

const updateUserInDB = async (username, firstName, lastName) => {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }
  const User = mongoose.model('User', UserSchema);
  const updatedUser = await User.updateOne({
    _id: user.id,
    first_name: firstName,
    last_name: lastName,
  }).lean();
  console.log(`Updated user: ${updatedUser}`);
  return updatedUser;
};

exports.connectDB = connectDB;
exports.addUser = addUser;
exports.getUser = getUser;
exports.getUserByUsername = getUserByUsername;
exports.updateUserInDB = updateUserInDB;
