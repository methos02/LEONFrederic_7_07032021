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
router.get('/:type([a-z]+)', auth, postCtrl.type);
router.post('/', multer.single('image'), validateData(postJoi, 'post'), auth, postCtrl.store);
router.get('/:id([0-9]+)', auth, postCtrl.show);
router.put('/:id', multer.single('image'), validateData(postJoi,'post'), auth, isAllowed(Post), postCtrl.update);
router.delete('/:id', auth, isAllowed(Post), postCtrl.delete);
router.post('/:id/like', auth, postCtrl.like);

module.exports = router;
