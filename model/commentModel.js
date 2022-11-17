const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    message: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

const commentModel = mongoose.model('comment', commentSchema);

module.exports = commentModel;