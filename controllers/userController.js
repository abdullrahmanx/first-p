// controllers/userController.js

const User = require('../MongoModel/userModel');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ------------------- Get All Users -------------------
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json({
            status: "success",
            results: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Sign Up -------------------
const signUp = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!email || !password) {
            return next(new AppError('Fail', 400, "Email and password are required"));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('Fail', 400, "Email already existed"));
        }

        const newUser = await User.create({ name, email, password, role });

        res.status(201).json({
            status: "success",
            data: { user: newUser }
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Login -------------------
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Fail', 400, "Email and password are required"));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new AppError('Fail', 400, "Incorrect Email or Password"));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError('Fail', 400, "Incorrect password"));
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name},
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.status(201).json({
            status: "logged in",
            token,
            User: user
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Get Profile -------------------
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return next(new AppError('Error', 404, 'User not found'));
        }
        res.status(201).json({
            status: 'success',
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Edit Profile -------------------
const editProfile = async (req, res, next) => {
    try {
        const updatedData = req.body;
        if (req.file) updatedData.profileImage = req.file.path;

        const editedProfile = await User.findByIdAndUpdate(
            req.user.id,
            { ...updatedData },
            { new: true, runValidators: true }
        );

        if (!editedProfile) {
            return next(new AppError('Error', 404, "User not found"));
        }

        res.status(200).json({
            status: "success",
            data: editedProfile
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Change Password -------------------
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return next(new AppError('Error', 400, "Please enter your old and new password"));
        }

        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return next(new AppError('Error', 404, "User not found"));
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return next(new AppError('Error', 404, "The password you entered is incorrect"));
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        res.status(201).json({
            status: "success",
            message: "Password changed successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Forgot Password -------------------
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError('Error', 404, "User not found"));
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/user/reset-password/${resetToken}`;

        res.status(200).json({
            status: "success",
            message: "Reset link generated",
            resetUrl
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Reset Password -------------------
const resetPassword = async (req, res, next) => {
    try {
        const resetToken = req.params.token;
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new AppError('Error', 400, "Token is invalid or expired"));
        }

        const { newPassword, confirmPassword } = req.body;
        if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
            return next(new AppError('Error', 400, "New password and confirmation do not match"));
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.markModified('password');

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            message: "Password changed successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Upload Profile Image -------------------
const uploadProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('Error', 400, "No file uploaded"));
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profileImage: req.file.path },
            { new: true, runValidators: true }
        );

        if (!user) {
            return next(new AppError('Error', 404, 'User not found'));
        }

        res.status(200).json({
            status: "success",
            message: "Photo uploaded successfully",
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- Export -------------------
module.exports = {
    getAllUsers,
    signUp,
    login,
    getProfile,
    editProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    uploadProfileImage
};
