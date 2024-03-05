/*******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/************************
 * Require Statements
 ************************/
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const connectPgSimple = require("connect-pg-simple")(session);

// Custom modules
const pool = require('./database/');
const baseController = require("./controllers/baseController");
const accountController = require("./controllers/accountController");
const utilities = require("./utilities/");

// Routes
const staticRoutes = require("./routes/static"); // Renamed for clarity
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoutes = require("./routes/accountRoutes");

const app = express();

/************************
 * Middleware
 ************************/
app.use(session({
  store: new connectPgSimple({
    pool: pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false, // Changed to false to avoid unnecessary session save
  saveUninitialized: false, // Changed to false for login sessions
  name: 'sessionId',
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Serve static files
app.use(express.static('public')); // Corrected to serve static files from the public directory

/************************
 * Routes
 ************************/
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.get("/error", utilities.handleErrors(baseController.buildError));
app.post('/register', utilities.handleErrors(accountController.registerAccount));
app.use("/account", utilities.handleErrors(accountRoutes));

// File Not Found Route - must be the last route
app.use((req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/************************
* Express Error Handler
************************/
app.use((err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message = err.status === 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav: [] // Assuming getNav() returns navigation items, replace [] with actual call if needed
  });
});

/************************
 * Server Configuration
 ************************/
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`App listening on ${HOST}:${PORT}`);
});
