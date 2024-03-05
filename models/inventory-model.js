const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  Get all data for a specific vehicle by vehicle ID
 * ************************** */
async function getInventoryById(vehicle_id) {
  const query = "SELECT * FROM public.inventory WHERE inv_id = $1";
  const data = await pool.query(query, [vehicle_id]);
  return data.rows[0];
}


/* ***************************
 *  Insert new classification into the database
 *  Unit 4 Assignment
 * ************************** */
async function addClassification(add_classification){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    return await pool.query(sql, [add_classification]);
  } catch (error) {
    return error.message;
  }
}


/* ***************************
 *  Check if the classification name is already in the database
 *  Unit 4 Assignment
 * ************************** */
async function checkExistingClassification(add_classification){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [add_classification])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get the classifications by id
 *  Unit 4 Assignment
 * ************************** */
async function getClassificationsById(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Insert new inventory item into the database
 *  Unit 4 Assignment
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
    return await pool.query(sql, [
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id
    ]);
  } catch (error) {
    return error.message;
  }
}



module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryById,
};



