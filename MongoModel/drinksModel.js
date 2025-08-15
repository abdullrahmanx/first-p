const mongoose = require('mongoose');
const drinkSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Drink name is required'],
            minlength: [2, 'Name must be at least 2 characters']
        },
        price: {
            type: Number,
            required: [true, "Price is Required"],
            min: [10, "Price must be atleast 10"]
        },
        inStock: {
            type: Boolean,
            required: [true, 'Please specify if the drink is in stock.']
        },
    },
    {
        versionKey: false 
    }
)


const Drinks = mongoose.model('Drink', drinkSchema)

module.exports = Drinks

