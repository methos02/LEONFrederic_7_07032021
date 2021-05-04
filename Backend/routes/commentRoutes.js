/**
 * Routes pour Sauces
 */

const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/commentController');
const auth = require('../middleware/auth');
const isAllowed = require('../middleware/isAllowed');
const Comment = require('../models').Comment;
const validateData = require('../middleware/validateData');
const hasRole = require('../middleware/hasRole');
const commentJoi = require('../schema/CommentJoi');

router.post('/', auth, validateData(commentJoi.create, 'comment'),  commentCtrl.store);
router.put('/:id', auth, isAllowed(Comment), validateData(commentJoi.update,'comment'), commentCtrl.update);
router.delete('/:id', auth, isAllowed(Comment), commentCtrl.delete);

module.exports = router;
