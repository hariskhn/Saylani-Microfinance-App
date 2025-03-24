import { Router } from 'express';
import { getAllLoanRequests, getLoanRequestById, updateLoanRequest, deleteLoanRequest } from "../controllers/loan.controller.js"
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protectRoute);

router.route('/').get( getAllLoanRequests );
router.route('/:loanId').get( getLoanRequestById );
router.route('/:loanId').patch( updateLoanRequest );
router.route('/:loanId').delete( deleteLoanRequest );

export default router;