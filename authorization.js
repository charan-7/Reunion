const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

// validating the incoming request
const authorization = function(req, res, next){
    if(req.originalUrl == "/api/authenticate/"){
        next();
    }else{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if(token == null){
            return res.send("not valid token");
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if(err){
                return res.send("invalid token: ", err);
            }
            else{
                req.user = user;
                next();
            }
        })
    }
}

module.exports = authorization;