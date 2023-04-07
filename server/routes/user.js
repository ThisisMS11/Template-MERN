const express = require('express');
const router = express.Router();

const { login, register, logout } = require('../controller/auth');
const { getProfile } = require('../controller/user');
const { protect } = require('../middleware/auth');

//! Protect is a middlewares that we have defined to ensure that the respective user trying to access the route is authenticated. 

router.get('/', protect, getProfile);

router.post('/login', login);
router.post('/register', register);
router.route('/logout').get(protect, logout);

module.exports = router;