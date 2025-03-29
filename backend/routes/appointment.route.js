import { Router } from 'express';
import { scheduleAppointment, fetchAnAppointment, fetchAllAppointments } from '../controllers/appointment.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protectRoute);

router.route('/:loanId').post( scheduleAppointment );
router.route('/:loanId').get( fetchAnAppointment );
router.route('/').get( fetchAllAppointments );

export default router;