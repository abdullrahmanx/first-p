// Routes: userRoutes.js

const express = require('express');
const router = express.Router();

// Controllers
const controllers = require('../controllers/userController');
// Middlewares
const verifyToken = require('../middlewares/verfiyToken'); // handles JWT verification
const authorizedRoles = require('../middlewares/authorizedRoles'); // handles role-based access
const upload = require('../middlewares/uploadUsersImage'); // handles file uploads
const loginLimit = require('../middlewares/LoginRateLimit');
const {loginValdiator, signupValidator}=require('../middlewares/validateUsers')



// ------------------- Public Routes -------------------
router.post('/signup', signupValidator,controllers.signUp);
router.post('/login',loginLimit,loginValdiator,controllers.login);
router.post('/forgotpassword', controllers.forgotPassword);
router.put('/reset-password/:token', controllers.resetPassword);

// ------------------- Protected Routes -------------------
router.get('/', verifyToken, authorizedRoles('admin'), controllers.getAllUsers);
router.get('/profile', verifyToken, controllers.getProfile);
router.put('/profile-edit', verifyToken, upload.single('profileImage'), controllers.updateProfile);
router.put('/changepassword', verifyToken, controllers.changePassword);
router.put('/user-upload-image', verifyToken, upload.single('profileImage'), controllers.uploadProfileImage);

module.exports = router;
