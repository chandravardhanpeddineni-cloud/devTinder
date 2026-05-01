const  User = require('../models/user')
const jwt = require('jsonwebtoken');
const userAuthMiddleWare = async (req, res, next) => {
    
try{

    const { token } = req.cookies;

    if(!token) {
        throw new Error("Token is not valid");
    }
    const decodeObj = await jwt.verify(token, "DEV@Tinder@1333");

    const { _id }  = decodeObj;

    const user = await User.findById(_id);

    if(!user) {
        throw new Error("User not found");
    }

    req.user = user;
    next();
}
catch(err) {
    res.status(400).send("Error: " + err.message);
}


}
module.exports = {
    userAuthMiddleWare
}