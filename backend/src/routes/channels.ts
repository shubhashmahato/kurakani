import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getChannels,
  getChannelByUsername,
  createChannel,
  subscribeChannel,
  unsubscribeChannel,
} from '../controllers/channelController';

const router = Router();

router.get('/', authenticate, getChannels);
router.get('/:username', getChannelByUsername);
router.post('/', authenticate, createChannel);
router.post('/:channelId/subscribe', authenticate, subscribeChannel);
router.post('/:channelId/unsubscribe', authenticate, unsubscribeChannel);

export default router;