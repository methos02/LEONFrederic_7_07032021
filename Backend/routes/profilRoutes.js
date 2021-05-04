/**
 * Routes pour l'utilisateur
 */
const express = require('express');
const router = express.Router();

const profilCtrl = require('../controllers/profilController');
const validateData = require('../middleware/validateData');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer_config');
const userJoi = require('../schema/UserJoi');

router.get('/:slug', auth, profilCtrl.show);
router.get('/search/:slug', auth, profilCtrl.search);
router.put('/', multer.single('avatar'), validateData(userJoi.profil_update, 'user'), auth, profilCtrl.update);
router.put('/password', auth, validateData(userJoi.password_update), profilCtrl.password);
router.delete('/', auth, profilCtrl.delete);

module.exports = router;
