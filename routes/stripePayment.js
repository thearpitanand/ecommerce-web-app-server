const express = require("express");
const router = express.Router();

// Controllers
const { makePayment } = require("../controllers/stripePayment");
const {
  isSignedIn,
  isAuthenticated,
} = require("../controllers/authentication");

router.post("/stripepayment", makePayment);

module.exports = router;
