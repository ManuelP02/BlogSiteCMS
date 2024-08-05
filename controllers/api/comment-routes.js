const router = require('express').Router();
const { Comment, User } = require('../../models');
const { isLoggedIn } = require('../../auth/auth');

router.post('/home', isLoggedIn, async (req, res) => {
    console.log('Received POST request:', req.body);
    try {
        const { postId, commentText } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            console.log('User not authenticated');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const newComment = await Comment.create({
            content: commentText,
            postId: postId,
            userId: userId,
        });

        const commentWithUser = await Comment.findByPk(newComment.id, {
            include: [{ model: User, attributes: ['username'] }]
        });

        console.log('Comment created successfully:', commentWithUser);
        res.status(201).json(commentWithUser);
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json({ message: 'Failed to create comment', error: err.message });
    }
});

module.exports = router;