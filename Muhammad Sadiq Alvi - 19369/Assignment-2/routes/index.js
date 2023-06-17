var express = require('express');
const AUTH = require('../auth/authenticate.js');
const { authenticate, signup } = AUTH;
const { updateUser, deleteUser } = require("../user/user.js");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/login', async function(req, res, next) {
  const user = await authenticate(req.body.username, req.body.password);
  if(user) {
    res.status(200).send({"user": user});
  } else {

    res.status(404).send("user not found");
  }
});

router.post('/signup', async function(req, res, next) {
  const user = await signup(req.body.username, req.body.password, req.body.email, req.body.firstName, req.body.lastName);
  if(user == "User already exists") {
    res.status(400).send("User already exists");
  } else {
    res.status(200).send({"user": user});
  }
});

router.put('/update', async function(req, res, next) {
  await updateUser(req, res);
});

router.delete('/delete', async function(req, res, next) {
  await deleteUser(req, res);
});

module.exports = router;
