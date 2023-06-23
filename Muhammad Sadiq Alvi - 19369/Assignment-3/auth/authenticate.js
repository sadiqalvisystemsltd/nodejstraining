/* eslint linebreak-style: ["error", "windows"] */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getReturnableUserObject } = require('../utils/utils');
const {
  addUser,
  getUser,
  getUserByUsername,
  updateUserToken,
} = require('../db');

const authenticate = async (username, password) => {
  const user = await getUser(username, password);
  if (user) {
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      },
    );
    const updatedUser = await updateUserToken(user, token);
    return getReturnableUserObject(updatedUser);
  }
  return null;
};

const signup = async (username, password, email, firstName, lastName, isAdmin = false) => {
  const dbUser = await getUserByUsername(username);
  if (dbUser) {
    return 'User already exists';
  }
  const hash = await bcrypt.hash(password, 10);
  const tokenKey = process.env.TOKEN_KEY;
  console.log(`Token key: ${tokenKey}`);
  console.log(`Is Admin: ${isAdmin}`);
  await addUser(username, hash, email, firstName, lastName, isAdmin);
  const addedUser = await getUserByUsername(username);
  const token = jwt.sign(
    { user_id: addedUser.id, email },
    tokenKey,
    {
      expiresIn: '2h',
    },
  );
  const signedUpUser = await updateUserToken(addedUser, token);
  return getReturnableUserObject(signedUpUser);
};

exports.authenticate = authenticate;
exports.signup = signup;
