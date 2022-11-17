const express = require('express');

const router = express.Router();

const postModel = require('../model/postModel');
const userModel = require('../model/userModel');
const commentModel = require('../model/commentModel');

// like a post
router.post('/like/', async(req, res) => {
    const { id } = req.query;
    const { email } = req.user;
    try{
        const getPost = await postModel.findById(id);
        const getUser = await userModel.findOne({
            email: email
        });
        if(getPost && getUser){
            getPost.likes.push(getUser._id);
            await getPost.save();
            return res.json({
                msg: 'liked successfully...',
            });
        }
        return res.json({
            msg: 'no post with that id...',
        });
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    } 
});

// unlike a post 
router.post('/unlike/', async(req, res) => {
    const { id } = req.query;
    const { email } = req.user;
    try{
        const getPost = await postModel.findById(id);
        const getUser = await userModel.findOne({
            email: email
        });
        if(getPost && getUser){
            getPost.likes.pull({ _id: getUser._id });
            await getPost.save();
            return res.json({
                msg: 'unliked successfully...',
            });
        }
        return res.json({
            msg: 'no post with that id...',
        })
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    } 
});

module.exports = router;