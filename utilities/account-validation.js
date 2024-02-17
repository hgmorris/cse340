const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email already exists. Please log in or use different email")
          }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}



/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid password"),
  ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}


/*  **********************************
 *  AccountUpdate Data Validation Rules
 * ********************************* */
validate.accountUpdateRules = () => {
  return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("A valid first name is required."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("A valid last name is required."), // on error this message is sent.

      body("account_id")
        .trim(),
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email, { req }) => {
          const account_id = req.body.account_id; // Access account_id from the request body
          const account = await accountModel.getAccountById(account_id);
          // Check if submitted email is the same as the existing one
          if (account_email !== account.account_email) {
            // No - Check if new email exists in the table
            const emailExists = await accountModel.checkExistingEmail(account_email);
            // Yes - throw an error
            if (emailExists) {
              throw new Error("Email exists. Please login or use a different email.");
            }}
            // req.flash("notice", `Your account has been updated`)
          })
          
  ]
}


/* ******************************
 * Check account data to make sure that it is all there when updating
 * ***************************** */
validate.checkAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/editAccount", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}


validate.passwordRules = () => {
  return [

    body("account_password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid password"),
  ]
}

module.exports = validate