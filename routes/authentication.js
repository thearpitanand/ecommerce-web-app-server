const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  signOut,
  signUp,
  signIn,
  isSignedIn,
} = require("../controllers/authentication");

//SignUp Route
router.post(
  "/signup",
  [
    check("firstName", "Name must be at least 3 character long").isLength({
      min: 3,
    }),
    check("email", "Email Is required").isEmail(),
    check("password", "password should be at least 5 char long").isLength({
      min: 5,
    }),
  ],
  signUp
);

//SignIn Route
router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 5 }),
  ],
  signIn
);

//SignOut Route
router.get("/signout", signOut);


module.exports = router;
