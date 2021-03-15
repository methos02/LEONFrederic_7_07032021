/**
 * Routes pour les posts
 */

const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/postController');
const multer = require('../middleware/multer_config');
const auth = require('../middleware/auth');
const isAllowed = require('../middleware/isAllowed');
const validateData = require('../middleware/validateData');
const Post = require('../models').Post;
const postJoi = require('../schema/PostJoi');

router.get('/', auth, postCtrl.index);
router.post('/', auth, multer, validateData(postJoi, 'post'),  postCtrl.store);
router.get('/:id', auth, postCtrl.show);
router.put('/:id', auth, isAllowed(Post), multer, validateData(postJoi,'post'), postCtrl.update);
router.delete('/:id', auth, isAllowed(Post), postCtrl.delete);
router.post('/:id/like', auth, postCtrl.like);

module.exports = router;
