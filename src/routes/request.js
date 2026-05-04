const express = require('express');
const { userAuthMiddleWare } = require('../Middlewares/auth')

const requestRouter = express.Router();


requestRouter.post("/sendConnectionReq", userAuthMiddleWare ,async (req, res) => {
    
    const { firstName } = req.user;
    //sending connection request

    res.send(firstName + " send connection request");
})




module.exports = {requestRouter};