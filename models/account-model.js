


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

module.exports = {registerAccount}