/**
 * Routes pour l'authentification
 */
const express = require('express');

const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/users', auth, isAdmin, adminCtrl.users);
router.put('/users/:id/ban', auth, isAdmin, adminCtrl.ban);
router.get('/comments', auth, isAdmin, adminCtrl.comments);

module.exports = router;
