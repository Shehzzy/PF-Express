const express = require('express');
const authenticateJWT = require('../Middlewares/authenticateMiddleware');
const authorizeRole = require('../Middlewares/authorizationMiddleware'); // Make sure it's imported correctly
const authController = require('../Controllers/auth-controller');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Admin-only route
router.get('/admin', authenticateJWT, authorizeRole('admin'), (authController.admin));

// User route (available to any logged-in user)
router.get('/user', authenticateJWT, authController.simpleUser);

module.exports = router;
