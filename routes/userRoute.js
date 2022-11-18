const express = require('express');

const router = express.Router();

const userModel = require('../model/userModel');

// get user profile
router.get('/user/', async(req, res) => {
    const { email } = req.user;
    try{
        const getUser = await userModel.findOne({
            email: email,
        });
        if(getUser){
            return res.status(200).json({
                email: getUser.email,
                followers: getUser.followers.length,
                following: getUser.following.length,
            });
        }else{
            return res.status(400).json({
                msg: 'no user with that email...',
            });
        }
    }catch(err){
        return res.status(404).json({
            msg: err,
        });
    }
});

// post request for following the specific user
router.post('/follow/:id', async(req, res) => {
    const { id } = req.params;
    const { email } = req.user;

    const fetchUser = await userModel.findById(id);

    if(fetchUser){
        try{
            const getUser = await userModel.findOne({
                email: email,
            });
            if(getUser._id.valueOf() != id){
                getUser.following.push(fetchUser._id);
                await getUser.save();
                fetchUser.followers.push(getUser._id);
                await fetchUser.save();
                return res.status(200).json({
                    msg: 'following the user successfully...',
                });
            }return res.status(400).json({
                msg: 'cannot follow your self...',
            });
        }catch(err){
            return res.status(404).json({
                msg: err,
            });
        }
    }
    return res.json({
        msg: 'no user with that id...',
    });
});

// post request for unfollowing specific user
router.post('/unfollow/:id', async(req, res) => {
    const { id } = req.params;
    const { email } = req.user;

    const fetchUser = await userModel.findById(id);
    
    if(fetchUser){
        try{
            const getUser = await userModel.findOne({
                email: email,
            });
            if(getUser._id.valueOf() != id){
                getUser.following.pull({_id: fetchUser._id});
                await getUser.save();
                return res.status(200).json({
                    msg: 'unfollowed the user successfully...',
                });
            }return res.status(400).json({
                msg: 'cannot unfollow your self...',
            });
        }catch(err){
            return res.status(404).json({
                msg: err,
            });
        }
    }
    return res.status(404).json({
        msg: 'no user with that id...',
    });
})

module.exports = router;