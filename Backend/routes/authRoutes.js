/**
 * Routes pour l'authentification
 */
const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const login_limiter =  require('../middleware/api_limiter').login_limiter();

const authCtrl = require('../controllers/authController');
const validateData = require('../middleware/validateData');
const authJoi = require('../schema/AuthJoi');

router.post('/signup', validateData(authJoi.signup), authCtrl.signup);
router.post('/login', login_limiter, validateData(authJoi.login), authCtrl.login);
router.get('/current_user', auth, authCtrl.currentUser);

module.exports = router;
