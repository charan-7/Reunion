const express = require('express');

const router = express.Router();

const postModel = require('../model/postModel');
const userModel = require('../model/userModel');
const commentModel = require('../model/commentModel');

// post a comment for particular post
router.post('/comment/', async(req, res) => {
    const { id } = req.query;
    const { message } = req.body;
    const { email } = req.user;
    try{
        const getUser = await userModel.findOne({
            email: email,
        });
        const getPost = await postModel.findById(id);
        if(getPost){
            const createComment = new commentModel({
                message: message,
                userId: getUser._id,
            });
            await createComment.save();
            getPost.comments.push(createComment._id);
            await getPost.save();
            return res.json({
                commentId: createComment._id,
            });
        }
        return res.json({
            msg: 'no user or post with that id...',
        })
    }catch(err){
        return res.status(404).json({
            msg: err,
        })
    }
})

module.exports = router;