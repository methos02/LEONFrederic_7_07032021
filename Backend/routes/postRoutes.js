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
const validParams = require('../middleware/validParams');
const {Post} = require('../config/database');
const postJoi = require('../schema/PostJoi');
const likeJoi = require('../schema/LikeJoi');

router.get('/:type((articles|images)?)', auth, postCtrl.index);
router.get('/:slug', validParams('slug'), auth, postCtrl.show);
router.post('/', multer.single('image'), validateData(postJoi.create, 'post'), auth, postCtrl.store);
router.put('/:id', validParams('id'), multer.single('image'), validateData(postJoi.update,'post'), auth, isAllowed(Post), postCtrl.update);
router.delete('/:id', validParams('id'), auth, isAllowed(Post), postCtrl.delete);
router.post('/:id/like', validParams('id'), validateData(likeJoi), auth, postCtrl.like);

module.exports = router;
