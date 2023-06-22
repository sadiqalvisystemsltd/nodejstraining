/* eslint linebreak-style: ["error", "windows"] */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getReturnableUserObject } = require('../utils/utils');
const { addUser, getUser, getUserByUsername } = require('../db');

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
    user.token = token;
    return getReturnableUserObject(user);
  }
  return null;
};

const signup = async (username, password, email, firstName, lastName) => {
  const dbUser = await getUserByUsername(username);
  if (dbUser) {
    return 'User already exists';
  }
  const hash = await bcrypt.hash(password, 10);
  const tokenKey = process.env.TOKEN_KEY;
  console.log(`Token key: ${tokenKey}`);
  await addUser(username, hash, email, firstName, lastName);
  const signedUpUser = await getUserByUsername(username);
  const token = jwt.sign(
    { user_id: signedUpUser.id, email },
    tokenKey,
    {
      expiresIn: '2h',
    },
  );
  signedUpUser.token = token;
  return getReturnableUserObject(signedUpUser);
};

exports.authenticate = authenticate;
exports.signup = signup;
