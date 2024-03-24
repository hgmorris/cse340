const utilities = require('../utilities/index');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav // Assume this is for navigation purposes
  });
}



/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    const messages= {error: ""}
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }


/* ***********************
 * Deliver Account view
 * Unit 5 deliver account team-activity
 *************************/
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()

  // This adds in the number of unread messages
  const account_id = parseInt(res.locals.accountData.account_id)
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  
    let nav = await utilities.getNav()
    const { account_firstName, 
      account_lastName, 
      account_email, 
      account_password 
    } = req.body
  
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  
    const regResult = await accountModel.registerAccount(
      account_firstName,
      account_lastName,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstName}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log("accountData",accountData)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
    console.log("password match")
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


 /* ***************************
 *  Build edit account view
 *  Unit 5 Task 4
 * ************************** */
 async function editAccountView(req, res, next) {
  const account_id = req.params.account_id
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  console.log("accountData",accountData)
  res.render("./account/editAccount", {
    title: `Edit Account`,
    nav,
    errors: null,
    account_id,
    account_firstName: accountData.account_firstname,
    account_lastName: accountData.account_lastname,
    account_email: accountData.account_email,
    
  })
}
  /* ****************************************
*  Unit 5 Task 4
*  Update Account Info
* ************************************ */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstName,
    account_lastName,
    account_email,
    account_id,
  } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstName,
    account_lastName,
    account_email,
    account_id,
  )

  const accountData = await accountModel.getAccountById(account_id)

  if (updateResult) {
    res.clearCookie("jwt")
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    req.flash("notice", `Your account has been updated.`)
    return res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/editAccount", {
      title: "Edit your account:",
      nav,
      errors: null,
      account_firstName,
      account_lastName,
      account_email,
    })
  }
}

/* ****************************************
*  Unit 5 Task 4
*  Update Account Info
* ************************************ */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_password,
    account_id,
  } = req.body

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error updating the password.')
    res.status(500).render("account/editAccount", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id,
  )

  const accountData = await accountModel.getAccountById(account_id)

  if (updateResult) {
    req.flash("notice", `Your password has been updated!`)
    res.clearCookie("jwt")
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, updating your password failed.")
    res.status(501).render("account/editAccount", {
      title: "Edit your account:",
      nav,
      errors: null,
    })
  }
}


 /* ***************************
 *  Logout account
 *  Unit 5 Task 6
 * ************************** */
 async function logoutAccount(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("../")
}
 

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement,
  editAccountView,
  updateAccount,
  logoutAccount,
  updatePassword,
}

