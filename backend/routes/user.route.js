import { Router } from 'express';
import { registerUser, loginUser, logoutUser, forgotPassword} from "../controllers/user.controller.js"
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/signup').post( registerUser );
router.route('/login').post( loginUser );
router.route('/logout').post( protectRoute, logoutUser );
router.route('/forgot-password').patch( protectRoute, forgotPassword );
// router.route('/refresh-token').post( refreshToken );

export default router;