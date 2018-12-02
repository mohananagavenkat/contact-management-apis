// this file exports a function which verifies the jwtoken

const jwt = require("jsonwebtoken");

//requiring config.js - for jwt secret key
const config = require("../config/config");

//exporting the actual function
module.exports = (req,res,next) =>{
    function sendAuthError(message){
        return res.status(200).json({
            status: false,
            auth: false,
            message: message
        });
    }
    let token;
    if(req.headers.authorization){
        token = req.headers.authorization.split(" ")[1]
    }else if(req.body.token){
        token = req.body.token;
    }else{
        return sendAuthError("Please send token along with request")
    }
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if(err)
            return sendAuthError(err.message);
        req.user = decoded;
        next();
    });
}