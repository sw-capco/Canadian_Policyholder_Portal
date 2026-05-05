import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { submitClaim } from '../controllers/claimController.js';

const router = express.Router();

router.post('/', requireAuth, submitClaim);

export default router;

