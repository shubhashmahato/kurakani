import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  initiateCall,
  getCallHistory,
  acceptCall,
  rejectCall,
  endCall,
} from '../controllers/callController';

const router = Router();
router.use(authenticate);

router.post('/initiate', initiateCall);
router.get('/history', getCallHistory);
router.post('/:callId/accept', acceptCall);
router.post('/:callId/reject', rejectCall);
router.post('/:callId/end', endCall);

export default router;