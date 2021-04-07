/**
 * Routes pour l'authentification
 */
const express = require('express');

const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const validateData = require('../middleware/validateData');
const banJoi = require('../schema/BanJoi')

router.get('/users', auth, isAdmin, adminCtrl.users);
router.put('/users/:id/ban', auth, isAdmin, validateData(banJoi),adminCtrl.ban);
router.get('/comments', auth, isAdmin, adminCtrl.comments);

module.exports = router;
