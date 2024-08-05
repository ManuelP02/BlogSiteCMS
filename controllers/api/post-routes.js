const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const { isLoggedIn } = require('../../auth/auth');

//Get all posts in home page route
router.get('/home', isLoggedIn, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ['username'] }],
          separate: true, // Idk if this gonna work, tired of reading docs
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const posts = dbPostData.map(post => post.get({ plain: true }));
    
    res.render('home', { 
      posts,
      loggedIn: req.session.loggedIn 
    });

  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).render('error', { message: 'Failed to load posts' });
  }
});



  //Get all posts for the loggedIn user route
  router.get('/dashboard', isLoggedIn, async (req, res) => {
    try {
      const userId = req.session.userId;
  
      const userPosts = await Post.findAll({
        where: { userId },
        include: [
          {
            model: User,
            attributes: ['username']
          },
          {
            model: Comment,
            include: [{ model: User, attributes: ['username'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      const posts = userPosts.map(post => post.get({ plain: true }));
  
      res.render('dashboard', { 
        posts,
        loggedIn: req.session.loggedIn 
      });
  
    } catch (err) {
      console.error('Error fetching user posts:', err);
      res.status(500).render('error', { message: 'Failed to load user posts' });
    }
  });

  //Create post route
  router.post('/dashboard', async (req, res) => {
    try {
      const { title, description } = req.body;
  
      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
      }
  
      if (!req.session.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const dbPostData = await Post.create({
        title,
        description,
        userId: req.session.userId
      });
  
      console.log('Post created:', dbPostData.toJSON());
  
      res.status(201).json({ post: dbPostData, message: 'Post created successfully' });
  
    } catch (err) {
      console.error('Error creating the post:', err);
      res.status(500).json({ message: 'An error occurred while creating the post', error: err.message });
    }
  });

//Destroy post route
  router.post('/dashboard/delete', isLoggedIn, async (req, res) => {
    try {
      const { postId } = req.body;
      const userId = req.session.userId;
  
      const post = await Post.findOne({ where: { id: postId, userId } });
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found or not authorized' });
      }
  
      await Post.destroy({ where: { id: postId, userId } });
  
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.error('Error deleting post:', err);
      res.status(500).json({ message: 'Failed to delete post', error: err.message });
    }
  });


  //Edit post route
  router.post('/dashboard/edit', isLoggedIn, async (req, res) => {
    try {
      const { postId, title, description } = req.body;
      const userId = req.session.userId;
  
      const post = await Post.findOne({ where: { id: postId, userId } });
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found or not authorized' });
      }
  
      await Post.update({ title, description }, { where: { id: postId, userId } });
  
      res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
      console.error('Error updating post:', err);
      res.status(500).json({ message: 'Failed to update post', error: err.message });
    }
  });


  module.exports = router;

