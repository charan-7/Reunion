const express = require('express');

const router = express.Router();

const userModel = require('../model/userModel');
const postModel = require('../model/postModel');
const { json } = require('express');

// create new post 
router.post('/posts/', async(req, res) => {
    const { email } = req.user;
    const { title, description } = req.body;

    const getUser = await userModel.findOne({
        email: email,
    });

    if(getUser){    
        try{
            const createPost = new postModel({
                title: title,
                description: description,
                userId: getUser._id,
            });
            await createPost.save();

            return res.json({
                postId: createPost._id,
                title: title,
                description: description,
                createdTime: createPost.createdTime
            });
        }catch(err){
            return res.status(404).json({
                msg: err,
            });
        }
    }
    return res.status(404).json({
        msg: 'no user with that email...',
    });
});

// get post details by post id
router.get('/posts/', async(req, res)=>{
    const { id } = req.query;
    try{
        const getPost = await postModel.findById(id);
        const totalLikes = getPost.likes.length;
        const totalComments = getPost.comments.length;
        return res.json({
            id: getPost._id,
            likeCount: totalLikes,
            commentCount: totalComments,
        });
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    }
});

// delete a post created by authenticated user
router.delete('/posts/', async(req, res)=>{
    const { email } = req.user;
    const { id } = req.query;
    try{
        const getPost = await postModel.findById(id);
        const getUser = await userModel.findOne({
            email: email,
        });
        if(getPost && getUser){
            if(getUser._id.valueOf() == getPost.userId.valueOf()){
                await postModel.deleteOne({ userId: getUser._id });
                return res.json({
                    msg: 'post deleted successfully...',
                });
            }else{  
                return res.json({
                    msg: 'no access to delete post...',
                });
            }
        }
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    }
})

// get all posts posted by authenticate user
router.get('/all_posts/', async(req, res) => {
    const { email } = req.user;
    try{
        const getUser = await userModel.findOne({
            email: email,
        });
        if(getUser){
            const projection = { message: 1 };
            const getPosts = await postModel.find({
                userId: getUser._id,
            })
            .populate('comments');
            return res.json({
                posts: getPosts,
            });
        }
        return res.json({
            msg: "no user with that email...",
        })
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    }
})

module.exports = router;