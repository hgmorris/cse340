
// In ./routes/accountRoute.js
const express = require("express");
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/'); 
const { route } = require("./static");
const regValidate = require("../utilities/account-validation");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
//route to registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to handle registration form submission
router.post(
"/register",
regValidate.registrationRules(),
regValidate.checkRegistrationData,
utilities.handleErrors(accountController.registerAccount)
)

// Login route
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default account route
router.get("/account", utilities.handleErrors(accountController.accountDashboard));


module.exports = router;
