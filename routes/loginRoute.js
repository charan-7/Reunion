const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const router = express.Router();

dotenv.config();

const userModel = require('../model/userModel');

// create or authenticate a user
router.post('/', async(req, res) => {
    const { email, password } = req.body;

    const token = jwt.sign({
        email: email,
        password: password,
    }, process.env.TOKEN_SECRET, { 
        expiresIn: '1800s' 
    });

    if(token){

        const findUser = await userModel.findOne({
            email: email,
        });

        if(findUser == null){
            const newUser = new userModel({
                email: email,
                password: password,
            });
    
            try{
                await newUser.save();
                return res.json({
                    "token": token,
                });
            }catch(err){
                return res.status(404).send("err");
            }
        }else{
            return res.status(200).json({
                "token": token,
            });
        }
    }
    return res.send("user not created...");
});

module.exports = router;