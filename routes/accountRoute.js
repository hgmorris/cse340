// const express = require("express")
// const router = new express.Router() 
// const accountController = require("../controllers/accountController")

// const utilities = require("../utilities")
// const regValidate = require('../utilities/account-validation')
// const validate = require("../utilities/account-validation")


// router.get(
//   "/login", 
//   utilities.handleErrors(accountController.buildLogin)
// );


// router.get(
//   "/register", 
//   utilities.handleErrors(accountController.buildRegister)
// )


// router.get(
//   "/",  
//   utilities.checkLogin,
//   utilities.handleErrors(accountController.buildAccountManagement)
// )


// router.post(
//   "/register",
//   regValidate.registrationRules(),
//   regValidate.checkRegData,
//   utilities.handleErrors(accountController.registerAccount)
// )



// router.post(
//   "/login",
//   regValidate.loginRules(),
//   regValidate.checkLoginData,
//   utilities.handleErrors(accountController.accountLogin)
// )


// router.get(
//   "/editAccount",
//   utilities.checkLogin,
//   utilities.handleErrors(accountController.editAccountView)
// )


// router.post(
//   "/update/", 
//   regValidate.accountUpdateRules(),
//   regValidate.checkAccountData,
//   utilities.handleErrors(accountController.updateAccount)
// )


// router.post(
//   "/update/password", 
//   regValidate.passwordRules(),
//   regValidate.checkAccountData,
//   utilities.handleErrors(accountController.updatePassword)
// )


// router.get(
//   "/logout",
//   utilities.handleErrors(accountController.logoutAccount)
// )


// module.exports = router;