import multer from 'multer';
import controllerProfile from '../controllers/controllerProfile.js';
import { Router } from 'express';

const upload = multer();

/** @type {Router} */
const router = Router();

router.get('/profile/edit', controllerProfile.renderEditProfilePage);

router.put('/profile/edit/:id', upload.single('profile_picture'), controllerProfile.updateProfile)

router.get('/profile/:id', controllerProfile.renderProfilePage);

export default router;