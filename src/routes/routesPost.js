import controllerPost from '../controllers/controllerPost.js';
import multer from 'multer';
import { Router } from 'express';

const upload = multer();

/** @type {Router} */
const router = Router();

router.post('/post', upload.single('post_image'), controllerPost.createNewPost);
router.post('/post/comment', controllerPost.createNewComment);

export default router;