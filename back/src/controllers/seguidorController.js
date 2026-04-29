import seguidorModel from '../models/seguidorModel.js';

/** POST /api/seguidores/follow  { id_seguidor, id_seguido } */
const followUser = async (req, res) => {
    try {
        const { id_seguidor, id_seguido } = req.body;
        if (!id_seguidor || !id_seguido)
            return res.status(400).json({ success: false, message: 'Faltan IDs' });
        if (id_seguidor == id_seguido)
            return res.status(400).json({ success: false, message: 'No puedes seguirte a ti mismo' });

        await seguidorModel.follow(id_seguidor, id_seguido);
        res.json({ success: true, message: 'Siguiendo' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** DELETE /api/seguidores/unfollow  { id_seguidor, id_seguido } */
const unfollowUser = async (req, res) => {
    try {
        const { id_seguidor, id_seguido } = req.body;
        if (!id_seguidor || !id_seguido)
            return res.status(400).json({ success: false, message: 'Faltan IDs' });

        await seguidorModel.unfollow(id_seguidor, id_seguido);
        res.json({ success: true, message: 'Dejado de seguir' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** GET /api/seguidores/:userId/followers */
const getFollowers = async (req, res) => {
    try {
        const followers = await seguidorModel.getFollowers(req.params.userId);
        res.json({ success: true, data: followers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** GET /api/seguidores/:userId/following */
const getFollowing = async (req, res) => {
    try {
        const following = await seguidorModel.getFollowing(req.params.userId);
        res.json({ success: true, data: following });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** GET /api/seguidores/:userId/isFollowing/:targetId */
const checkIsFollowing = async (req, res) => {
    try {
        const result = await seguidorModel.isFollowing(req.params.userId, req.params.targetId);
        res.json({ success: true, isFollowing: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** GET /api/seguidores/:userId/counts */
const getCounts = async (req, res) => {
    try {
        const counts = await seguidorModel.getCounts(req.params.userId);
        res.json({ success: true, data: counts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default { followUser, unfollowUser, getFollowers, getFollowing, checkIsFollowing, getCounts };
