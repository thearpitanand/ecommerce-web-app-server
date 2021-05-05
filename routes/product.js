const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  removeProduct,
  updateProduct,
  getAllProduct,
  getAllUniqueCategory,
} = require("../controllers/product");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controllers/authentication");
const { getUserById } = require("../controllers/user");
const { isArguments } = require("lodash");

//Params
router.param("productId", getProductById);
router.param("userId", getUserById);

//Create Product Routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//Read Product Routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//Delete Product Routes
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeProduct
);

//Update Product Routes
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//Listing Routes
router.get("/products", getAllProduct);
router.get("/products/categories", getAllUniqueCategory);

module.exports = router;
