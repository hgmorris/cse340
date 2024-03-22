


const pool = require('../database/')


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstName, account_lastName, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstName, account_lastName, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstName, account_lastName, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 *   Unit 4
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstName, account_lastName, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

// Get account by id


/* *****************************
* Return account data using account id
* ***************************** */

async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstName, account_lastName, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateAccount(
  account_firstName,
  account_lastName,
  account_email,
  account_id,
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstName = $1, account_lastName = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstName,
      account_lastName,
      account_email,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Unit 5 Task 4
 *  Update Password 
 * ************************** */
async function updatePassword(
  account_password,
  account_id,
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      account_password,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail,
  updateAccount,
  updatePassword,
  getAccountById,
}