/*******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require('./utilities/');
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")





/************************
 * Middleware
 ************************/
/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 

// Unit 5 Login JWT and Cookie
app.use(cookieParser())

// Unit 5 Login JWT and Cookie
app.use(utilities.checkJWTToken)



/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root



/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))


// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Account routes - Unit 3
app.use("/account", utilities.handleErrors(require("./routes/accountRoutes")))

// Inventory routes - Unit 3 
app.use("/inv", utilities.handleErrors(require("./routes/inventoryRoute")))

// Route for admin to view unapproved classifications and inventory items
app.get("/admin/unapproved", utilities.handleErrors(baseController.buildAdmin))

// JavaScript (Express.js)

app.get('/account', async (req, res) => {
  try {
    // Get account data and classification list from the database
    const accountData = await getAccountData(req.user.id); // replace with your function
    const classificationList = await getClassificationList(); // replace with your function

    // Render the account view with the account data and classification list
    res.render('account', { accountData, classificationList });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});



// Error Route (For testing and Assignment 3)
app.get("/error", utilities.handleErrors(baseController.buildError))

// File Not Found Route 
// Must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/************************
 * Server Configuration
 ************************/
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; 


app.listen(PORT, HOST, () => {
  console.log(`App listening on ${HOST}:${PORT}`);
});
