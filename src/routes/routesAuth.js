import middlewares from '../middlewares/middlewares.js';
import controllerAuth from '../controllers/controllerAuth.js';
import { Router } from 'express';

/** @type {Router} */
const router = Router();

router.get('/auth', middlewares.redirectIfLoggedIn, controllerAuth.renderAuthPage);
router.post('/login', controllerAuth.loginUser);
router.post('/signup', controllerAuth.signupUser);
router.post('/logout', controllerAuth.logout);

export default router;
