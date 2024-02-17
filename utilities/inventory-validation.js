const invModel = require("../models/inventory-model");
const utilities = require(".");
const validate = {};

validate.classificationRules = () => {
  return [
    body("add_classification")
      .trim()
      .isLength({ min: 4 })
      .matches(/^[^\s]+$/, "g")
      .withMessage("Please enter a valid classification name")
      .custom(async (add_classification) => {
        const classificationExists = await invModel.checkExistingClassification(
          add_classification
        );
        if (classificationExists) {
          throw new Error(
            "Classification with that name already exists. Please try a different name."
          );
        }
      }),
  ];
};

validate.inventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 3 }).withMessage("Please enter a valid vehicle make."),
    body("inv_model").trim().isLength({ min: 3 }).withMessage("Please enter a valid vehicle model."),
    body("inv_year").trim().isLength({ max: 4, min: 4 }).withMessage("Please enter a valid vehicle year."),
    body("inv_description").trim().isLength({ max: 150, min: 1 }).withMessage("Please enter a valid vehicle description."),
    body("inv_image").trim().isLength({ min: 3 }).withMessage("Please enter a valid vehicle image."),
    body("inv_thumbnail").trim().isLength({ min: 3 }).withMessage("Please enter a valid vehicle thumbnail."),
    body("inv_price").trim().isLength({ min: 1 }).withMessage("Please enter a valid vehicle price."),
    body("inv_miles").trim().isLength({ min: 1 }).withMessage("Please enter a valid vehicle miles."),
    body("inv_color").trim().isLength({ min: 1 }).withMessage("Please enter a valid vehicle color."),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { add_classification } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      add_classification,
    });
    return;
  }
  next();
};

validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let selectList = await utilities.getClassifications(classification_id);
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      selectList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let selectList = await utilities.getClassifications(classification_id);
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      nav,
      selectList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};


module.exports = validate;