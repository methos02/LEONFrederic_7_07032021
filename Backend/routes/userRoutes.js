/**
 * Routes pour l'utilisateur
 */
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userController');
const validateData = require('../middleware/validateData');
const auth = require('../middleware/auth');
const userJoi = require('../schema/UserJoi');

router.put('/:id', auth, validateData(userJoi.profil_update), userCtrl.update);
router.put('/:id/password', validateData(userJoi.password_update), auth, userCtrl.password);
router.delete('/:id', auth, userCtrl.delete);

module.exports = router;
