import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { downloadProof, getPolicy } from '../controllers/policyController.js';

const router = express.Router();

router.get('/:policyNumber', requireAuth, getPolicy);

router.get('/:policyNumber/proof', requireAuth, downloadProof);

export default router;
