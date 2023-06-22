const express = require('express');
const AUTH = require('../auth/authenticate');
const { updateUser, deleteUser } = require('../user/user');

const { authenticate, signup } = AUTH;
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/login', async (req, res) => {
  const user = await authenticate(req.body.username, req.body.password);
  if (user) {
    res.status(200).send({ user });
  } else {
    res.status(404).send('user not found');
  }
});

router.post('/signup', async (req, res) => {
  const user = await signup(
    req.body.username,
    req.body.password,
    req.body.email,
    req.body.firstName,
    req.body.lastName,
  );
  if (user === 'User already exists') {
    res.status(400).send('User already exists');
  } else {
    res.status(200).send({ user });
  }
});

router.put('/update', async (req, res) => {
  await updateUser(req, res);
});

router.delete('/delete', async (req, res) => {
  await deleteUser(req, res);
});

module.exports = router;
