/* eslint linebreak-style: ["error", "windows"] */
const { ALL_USERS } = require('../auth/authenticate');
const { getReturnableUserObject } = require('../utils/utils');
const { updateUserInDB } = require('../db');

const updateUser = async (req, res) => {
  const user = await updateUserInDB(req.body.username, req.body.firstName, req.body.lastName);
  if (user) {
    res.status(200).send({ user: getReturnableUserObject(user) });
  } else {
    res.status(404).send('User Not Found');
  }
};

const deleteUser = (req, res) => {
  for (let i = 0; i < ALL_USERS.length; i += 1) {
    if (ALL_USERS[i].username === req.body.username) {
      res.status(200).send('User deleted successfully!');
      return;
    }
  }
  res.status(404).send('User Not Found');
};

exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
