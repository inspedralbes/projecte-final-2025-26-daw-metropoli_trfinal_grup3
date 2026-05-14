import express from 'express';
import seguidorController from '../controllers/seguidorController.js';

const router = express.Router();

router.post('/follow', seguidorController.followUser);
router.delete('/unfollow', seguidorController.unfollowUser);
router.get('/:userId/followers', seguidorController.getFollowers);
router.get('/:userId/following', seguidorController.getFollowing);
router.get('/:userId/isFollowing/:targetId', seguidorController.checkIsFollowing);
router.get('/:userId/counts', seguidorController.getCounts);

export default router;
