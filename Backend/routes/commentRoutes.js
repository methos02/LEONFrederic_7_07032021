/**
 * Routes pour les commentaires
 */

const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/commentController');
const auth = require('../middleware/auth');
const isAllowed = require('../middleware/isAllowed');
const {Comment} = require('../config/database');
const validateData = require('../middleware/validateData');
const validParams = require('../middleware/validParams');
const commentJoi = require('../schema/CommentJoi');

router.post('/', auth, validateData(commentJoi.create, 'comment'),  commentCtrl.store);
router.put('/:id', validParams('id'), auth, isAllowed(Comment), validateData(commentJoi.update,'comment'), commentCtrl.update);
router.delete('/:id', validParams('id'), auth, isAllowed(Comment), commentCtrl.delete);

module.exports = router;
