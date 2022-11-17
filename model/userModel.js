const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: { type: String, select: false },
    followers: { type: [mongoose.Schema.Types.ObjectId], ref: 'user'},
    following: { type: [mongoose.Schema.Types.ObjectId], ref: 'user'},
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;