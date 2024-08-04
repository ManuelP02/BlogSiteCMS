const router = require('express').Router();
const { Post } = require('../../models');


router.get('/home', async(req, res) => {
    try{
      const dbPostData = await Post.findAll({

      });
      res.status(200).json(dbPostData);
    }catch (err){
      res.status(500).json(err);
    }
 
  });

  router.post('/dashboard', async(req,res) =>{
    try{
        const {title, description} = req.body;
        if(!title || !description){
            return res.status(400).json({message: 'Title and description are required'});
        }
        const dbPostData = await Post.create({
            title,
            description,
            // userId: req.session.userId
        });
        res.status(201).json({post: dbPostData, message:'Post created succesfully'});

    }catch(err){
        console.log('Error creating the post:', err);
        res.status(500).json({message: 'An error ocurred while creating the post', error: err.message});
    }
  });

  module.exports = router;

