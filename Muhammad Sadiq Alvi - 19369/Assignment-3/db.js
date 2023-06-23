/* eslint linebreak-style: ["error", "windows"] */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  console.log('Connecting to database');
  await mongoose.connect(process.env.MONGO_DB_URI).then((res) => {
    console.log(`DB Connected to: ${process.env.MONGO_DB_URI}`, res);
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
  is_admin: Boolean,
  token: String,
});

const addUser = async (username, password, email, firstName, lastName, isAdmin = false) => {
  const User = mongoose.model('User', UserSchema);
  const newUser = new User({
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    username,
    is_admin: isAdmin,
  });
  await newUser.save();
  console.log(`Is Admin from Added User: ${newUser.is_admin}`);
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

const getUserByToken = async (token) => {
  const User = mongoose.model('User', UserSchema);
  const user = await User.findOne({ token }).lean();
  return user;
};

const updateUserInDB = async (username, firstName, lastName) => {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }
  const User = mongoose.model('User', UserSchema);
  await User.findOneAndUpdate({ username }, {
    first_name: firstName,
    last_name: lastName,
  }).lean();
  const updatedUser = await getUserByUsername(username);
  console.log(`Updated user: ${updatedUser}`);
  return updatedUser;
};

const updateUserToken = async (user, token) => {
  const User = mongoose.model('User', UserSchema);
  await User.findOneAndUpdate({
    username: user.username,
  }, {
    token,
  }).lean();
  const updatedUser = getUserByUsername(user.username);
  return updatedUser;
};

const deleteUserFromDB = async (username) => {
  const User = mongoose.model('User', UserSchema);
  try {
    const deletedUser = await User.findOneAndDelete({ username }).lean();
    console.log('Deleted user: ', deletedUser);
    return deletedUser;
  } catch (err) {
    console.log("Can't delete", err);
    return false;
  }
};

exports.connectDB = connectDB;
exports.addUser = addUser;
exports.getUser = getUser;
exports.getUserByUsername = getUserByUsername;
exports.updateUserInDB = updateUserInDB;
exports.deleteUserFromDB = deleteUserFromDB;
exports.getUserByToken = getUserByToken;
exports.updateUserToken = updateUserToken;
