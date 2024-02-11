import controllerIndex from '../controllers/controllerIndex.js';
import { Router } from 'express';

/** @type {Router} */
const router = Router();

router.get('/', controllerIndex.renderHomePage);
router.post('/new-post', controllerIndex.renderNewPostForm);

export default router;