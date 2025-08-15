const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const { string, func } = require('joi');
const mongoose = require('mongoose')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user'
    },
    name: {
        type: String,
        required: [true, 'Name is Required']
    },

    token: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    profileImage: {
    type: String
    }
  
},
    {
        versionKey: false 
    }
)



userSchema.methods.getResetPasswordToken= function () {
    const resetToken= crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken= crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire= Date.now() + 15 * 60 *1000;
    return resetToken
}



userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        next()
    } else {
        next()
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
