const express = require('express');
const AUTH = require('../auth/authenticate');
const { updateUser, deleteUser } = require('../user/user');
const db = require('../db');

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
    req.body.isAdmin ? req.body.isAdmin : false,
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

router.post('/create-category', async (req, res) => {
  await db.createCategory(req.body.categoryTitle);
  res.status(200).send('Category created!');
});

router.post('/create-product', async (req, res) => {
  await db.createProduct(req.body.productTitle, req.body.totalInStock, req.body.categoryTitle);
  res.status(200).send('Product created!');
});

router.post('/add-product-to-cart', async (req, res) => {
  await db.addProductsToCart(req.body.username, req.body.productTitle, req.body.quantity);
  res.status(200).send('Product added to cart!');
});

module.exports = router;
