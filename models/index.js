const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

//Relationships

Post.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Post.hasMany(Comment, {
    foreignKey: 'postId',
    onDelete: 'CASCADE'
});

Comment.belongsTo(User,{
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})

Comment.belongsTo(Post,{
    foreignKey: 'postId'
});

module.exports = {
User,Post,Comment
};

