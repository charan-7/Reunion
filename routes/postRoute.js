const express = require('express');

const router = express.Router();

const userModel = require('../model/userModel');
const postModel = require('../model/postModel');

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

            return res.status(200).json({
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
    return res.status(400).json({
        msg: 'no user with that email...',
    });
});

// get post details by post id
router.get('/posts/:id', async(req, res)=>{
    const { id } = req.params;
    try{
        const getPost = await postModel.findById(id);
        if(getPost){
            const totalLikes = getPost.likes.length;
            const totalComments = getPost.comments.length;
            return res.status(200).json({
                id: getPost._id,
                likeCount: totalLikes,
                commentCount: totalComments,
            });
        }
        return res.status(400).send('no post with that id...');
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    }
});

// delete a post created by authenticated user
router.delete('/posts/:id', async(req, res)=>{
    const { email } = req.user;
    const { id } = req.params;
    try{
        const getPost = await postModel.findById(id);
        const getUser = await userModel.findOne({
            email: email,
        });
        if(getPost && getUser){
            if(getUser._id.valueOf() == getPost.userId.valueOf()){
                await postModel.deleteOne({ userId: getUser._id });
                return res.status(200).json({
                    msg: 'post deleted successfully...',
                });
            }else{  
                return res.status(401).json({
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
            return res.status(200).json({
                posts: getPosts,
            });
        }
        return res.status(400).json({
            msg: "no user with that email...",
        })
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    }
})

module.exports = router;