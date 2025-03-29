import { Router } from 'express';
import { fetchAllApplications, updateApplicationStatus } from '../controllers/application.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protectRoute);

router.route('/').get( fetchAllApplications );
router.route('/:loanId').patch( updateApplicationStatus );

export default router;