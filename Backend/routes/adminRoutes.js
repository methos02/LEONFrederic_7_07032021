/**
 * Routes pour l'authentification
 */
const express = require('express');

const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/auth');
const hasRole = require('../middleware/hasRole');
const validateData = require('../middleware/validateData');
const validParams = require('../middleware/validParams');
const banJoi = require('../schema/BanJoi')

router.get('/users', auth, hasRole('modo'), adminCtrl.users);
router.get('/search/:slug', validParams('slug'), auth, adminCtrl.search);
router.put('/users/:id/ban', validParams('id'), auth, hasRole('modo'), validateData(banJoi),adminCtrl.ban);
router.get('/comments', auth, hasRole('modo'), adminCtrl.comments);

module.exports = router;
