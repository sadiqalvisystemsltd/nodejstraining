/* eslint linebreak-style: ["error", "windows"] */
const { getReturnableUserObject } = require('../utils/utils');
const { updateUserInDB, deleteUserFromDB } = require('../db');

const updateUser = async (req, res) => {
  const user = await updateUserInDB(req.body.username, req.body.firstName, req.body.lastName);
  if (user) {
    res.status(200).send({ user: getReturnableUserObject(user) });
  } else {
    res.status(404).send('User Not Found');
  }
};

const deleteUser = async (req, res) => {
  if (await deleteUserFromDB(req.body.username)) {
    res.status(200).send('User deleted successfully');
  } else {
    res.status(404).send('User Not Found');
  }
};

exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
