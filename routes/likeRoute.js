const express = require('express');

const router = express.Router();

const postModel = require('../model/postModel');
const userModel = require('../model/userModel');
const commentModel = require('../model/commentModel');

// like a post
router.post('/like/:id', async(req, res) => {
    const { id } = req.params;
    const { email } = req.user;
    try{
        const getPost = await postModel.findById(id);
        const getUser = await userModel.findOne({
            email: email
        });
        if(getPost && getUser){
            getPost.likes.push(getUser._id);
            await getPost.save();
            return res.status(200).json({
                msg: 'liked successfully...',
            });
        }
        return res.status(400).json({
            msg: 'no post with that id...',
        });
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    } 
});

// unlike a post 
router.post('/unlike/:id', async(req, res) => {
    const { id } = req.params;
    const { email } = req.user;
    try{
        const getPost = await postModel.findById(id);
        const getUser = await userModel.findOne({
            email: email
        });
        if(getPost && getUser){
            getPost.likes.pull({ _id: getUser._id });
            await getPost.save();
            return res.status(200).json({
                msg: 'unliked successfully...',
            });
        }
        return res.status(400).json({
            msg: 'no post with that id...',
        })
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    } 
});

module.exports = router;