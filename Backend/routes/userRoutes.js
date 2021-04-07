/**
 * Routes pour l'utilisateur
 */
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userController');
const validateData = require('../middleware/validateData');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer_config');
const userJoi = require('../schema/UserJoi');

router.get('/', auth, userCtrl.show);
router.put('/:id', multer.single('avatar'), validateData(userJoi.profil_update, 'user'), auth, userCtrl.update);
router.put('/:id/password', auth, validateData(userJoi.password_update), userCtrl.password);
router.delete('/:id', auth, userCtrl.delete);

module.exports = router;
