const express = require("express");
const router = express.Router();

const {
  isSignedIn,
  isAuthenticated,
} = require("../controllers/authentication");
const { processPayment, getToken } = require("../controllers/brainTreePayment");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);

// Payment Routes
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;
