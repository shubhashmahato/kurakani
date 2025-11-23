import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getStories,
  createStory,
  viewStory,
  reactToStory,
  deleteStory,
} from '../controllers/storyController';

const router = Router();
router.use(authenticate);

router.get('/', getStories);
router.post('/', createStory);
router.post('/:storyId/view', viewStory);
router.post('/:storyId/react', reactToStory);
router.delete('/:id', deleteStory);

export default router;