/**
 * Routes pour l'authentification
 */
const express = require('express');

const router = express.Router();
const login_limiter =  require('../middleware/api_limiter').login_limiter();

const authCtrl = require('../controllers/authController');
const validateData = require('../middleware/validateData');
const authJoi = require('../schema/AuthJoi');

router.post('/signup', validateData(authJoi), authCtrl.signup);
router.post('/login', login_limiter, authCtrl.login);

module.exports = router;
