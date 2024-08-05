const router = require('express').Router();
//Routes
const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');
//Using Routes
router.use('/', userRoutes);
router.use('/', commentRoutes);
router.use('/', postRoutes);


module.exports = router;
