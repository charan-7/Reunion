const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdTime: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'user' },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'comment' },
});

const postModel = mongoose.model('post', postSchema);

module.exports = postModel;