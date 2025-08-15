// controllers/drinkControllers.js

const Drink = require('../MongoModel/drinksModel');
const AppError = require('../utils/AppError');

// ------------------- Get All Drinks -------------------
const getallDrinks = async (req, res, next) => {
    try {
        const drinks = await Drink.find();
        res.json({
            status: "success",
            results: drinks.length,
            data: drinks
        });
    } catch (err) {
        next(err); // pass to global error handler
    }
};

// ------------------- Get Specific Drink -------------------
const getspecificDrink = async (req, res, next) => {
    try {
        const id = req.params.id;
        const drink = await Drink.findById(id);

        if (!drink) {
            const error = new AppError('Error', 404, "Drink Not Found");
            return next(error);
        }

        res.status(200).json({
            status: "success",
            data: drink
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// ------------------- Add a Drink -------------------
const addDrink = async (req, res, next) => {
    try {
        const { name, price, inStock } = req.body;
        const newDrink = await Drink.create({ name, price, inStock });

        // Notify via Socket.io
        req.app.get("io").emit("drinkAdded", newDrink);

        res.status(201).json({
            status: "success",
            data: newDrink
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Edit a Drink -------------------
const editDrink = async (req, res, next) => {
    try {
        const id = req.params.id;
        const editDrink = await Drink.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!editDrink) {
            const error = new AppError('Error', 404, "Drink Not Found");
            return next(error);
        }

        // Save changes and notify via Socket.io
        editDrink.save();
        req.app.get("io").emit("editDrink", editDrink);

        res.json({
            status: "success",
            data: editDrink
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Delete a Drink -------------------
const deleteDrink = async (req, res, next) => {
    try {
        const id = req.params.id;
        const drink = await Drink.findByIdAndDelete(id);

        if (!drink) {
            const error = new AppError('Error', 404, "Drink Not Found");
            return next(error);
        }

        // Notify via Socket.io
        req.app.get("io").emit("deleteDrink", drink);

        res.json({
            status: "success",
            message: "Deleted Success"
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Export -------------------
module.exports = {
    getallDrinks,
    getspecificDrink,
    addDrink,
    editDrink,
    deleteDrink
};
