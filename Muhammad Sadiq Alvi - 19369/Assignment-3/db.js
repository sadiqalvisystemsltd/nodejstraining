/* eslint linebreak-style: ["error", "windows"] */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { sendMail } = require('./utils/utils');

const connectDB = async () => {
  console.log(`Connecting to database process: ${process.pid}`);
  await mongoose.connect(process.env.MONGO_DB_URI).then((res) => {
    console.log(`DB Connected to: ${process.env.MONGO_DB_URI}, process: ${process.pid}`, res);
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

const CategorySchema = new Schema({
  title: String,
});

const ProductSchema = new Schema({
  title: String,
  totalInStock: Number,
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
});

const ProductOrderSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
});

const CartSchema = new Schema({
  productOrders: [{ type: Schema.Types.ObjectId, ref: 'ProductOrder' }],
  username: String,
});

const addProductsToCart = async (username, productTitle, quantity) => {
  const ProductOrder = mongoose.model('ProductOrder', ProductOrderSchema);
  const Product = mongoose.model('Product', ProductSchema);
  const product = await Product.findOne({ title: productTitle }).lean();
  if (!product) {
    return 'PRODUCT DOES NOT EXIST';
  }
  if (!product.totalInStock || product.totalInStock < quantity) {
    return 'PRODUCT UNAVAILABLE';
  }
  const remainingInStock = product.totalInStock - quantity;
  const Cart = mongoose.model('Cart', CartSchema);
  const newProductOrder = new ProductOrder({
    product,
    quantity,
  });
  await newProductOrder.save();
  let cart = await Cart.findOne({ username }).lean();
  if (cart && cart.productOrders) {
    const { productOrders } = cart;
    productOrders.push(newProductOrder);
    await Cart.findOneAndUpdate({ username }, {
      productOrders,
    });
    console.log('Updating Product Orders');
  } else {
    cart = new Cart({
      productOrders: [newProductOrder],
      username,
    });
    await cart.save();
  }
  await Product.findOneAndUpdate({ title: productTitle }, {
    totalInStock: remainingInStock,
  });
  return null;
};

const createProduct = async (productTitle, totalInStock, categoryTitle) => {
  const Product = mongoose.model('Product', ProductSchema);
  const product = await Product.findOne({ title: productTitle }).lean();
  if (product) {
    await Product.findOneAndUpdate({ title: productTitle }, {
      totalInStock,
    });
    return;
  }
  const Category = mongoose.model('Category', CategorySchema);
  const category = await Category.findOne({ title: categoryTitle }).lean();
  if (category) {
    const newProduct = new Product({
      title: productTitle,
      totalInStock,
      category,
    });
    await newProduct.save();
  }
};

const createCategory = async (categoryTitle) => {
  const Category = mongoose.model('Category', CategorySchema);
  const category = await Category.findOne({ title: categoryTitle }).lean();
  if (category) {
    console.log(`Category exists: ${category}`);
    return 'CATEGORY ALREADY EXISTS';
  }
  const newCategory = new Category({
    title: categoryTitle,
  });
  console.log(`New Category creating: ${newCategory}`);
  await newCategory.save();
  return null;
};

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

const checkout = async (user) => {
  const ProductOrder = mongoose.model('ProductOrder', ProductOrderSchema);
  mongoose.model('Product', ProductSchema);
  const Cart = mongoose.model('Cart', CartSchema);
  const userCart = await Cart.findOne({ username: user.username }).populate('productOrders').exec();
  const userOrderMap = {};
  if (userCart) {
    const { productOrders } = userCart;
    console.log(`Product Orders: ${productOrders}`);
    await Promise.all(productOrders.map(async (productOrder) => {
      const poWithProduct = await ProductOrder.findOne({ _id: productOrder.id }).populate('product').exec();
      if (poWithProduct.product.title in userOrderMap) {
        userOrderMap[`${poWithProduct.product.title}`] += poWithProduct.quantity;
      } else {
        userOrderMap[`${poWithProduct.product.title}`] = poWithProduct.quantity;
      }
    }));
    console.log(`User Order Map: ${JSON.stringify(userOrderMap)}`);
    sendMail(user, userOrderMap);
    await Cart.deleteMany({ username: user.username });
  }
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
exports.createCategory = createCategory;
exports.createProduct = createProduct;
exports.addProductsToCart = addProductsToCart;
exports.checkout = checkout;
