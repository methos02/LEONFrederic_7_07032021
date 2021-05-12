/**
 * Routes pour l'utilisateur
 */
const express = require('express');
const router = express.Router();

const profilCtrl = require('../controllers/profilController');
const validateData = require('../middleware/validateData');
const validParams = require('../middleware/validParams');
const auth = require('../middleware/auth');
const hasRole = require('../middleware/hasRole');
const multer = require('../middleware/multer_config');
const userJoi = require('../schema/UserJoi');

router.get('/:slug', validParams('slug'), auth, profilCtrl.show);
router.get('/search/:slug', validParams('slug'), auth, profilCtrl.search);
router.put('/', multer.single('avatar'), validateData(userJoi.profil_update, 'user'), auth, profilCtrl.update);
router.put('/password', auth, validateData(userJoi.password_update), profilCtrl.password);
router.put('/roles/:id', validParams('id'), auth, validateData(userJoi.roles_update), hasRole('admin'), profilCtrl.roles);
router.delete('/', auth, profilCtrl.delete);

module.exports = router;
