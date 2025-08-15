// Routes: drinkRoutes.js (cleaned)

const express = require('express');
const router = express.Router();

// Controllers
const controllers = require('../controllers/drinkControllers');

// Middlewares
const validateDrink = require('../middlewares/valdiateDrink');
const verifyToken = require('../middlewares/verfiyToken');
const authorizedRoles = require('../middlewares/authorizedRoles');

// ------------------- Routes -------------------

// /drinks
router.route('/')
    .get(verifyToken, authorizedRoles('admin'), controllers.getallDrinks)  // get all drinks
    .post(validateDrink, verifyToken, authorizedRoles('admin', 'manager'), controllers.addDrink); // add drink

// /drinks/:id
router.route('/:id')
    .get(controllers.getspecificDrink) // get specific drink
    .put(validateDrink, verifyToken, authorizedRoles('admin', 'manager'), controllers.editDrink) // edit drink
    .delete(verifyToken, authorizedRoles('admin'), controllers.deleteDrink); // delete drink

module.exports = router;
