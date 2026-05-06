const express = require('express');
const { userAuthMiddleWare } = require('../Middlewares/auth')

const requestRouter = express.Router();
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post("/send/:status/:toUserId", userAuthMiddleWare ,async (req, res) => {
    
   try{
         const fromUserId = req.user._id;
         const toUserId = req.params.toUserId;
         const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];


        
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status type: " + status});
        }


        const toUserExist = await User.findById(toUserId);
        if(!toUserExist) {
            return res.status(404).json({message: "User not found!!!"});
        }

        //if there is an existing connection

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if(existingConnectionRequest) {
            return res.status(400).json({message: "Connection Request Already exists"});
        }
         const connectionReq = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
         });

         const data = await connectionReq.save();

         res.json({
            message: req.user.firstName + " is "+ status +" in "+ toUserExist.firstName,
            data
         }); 
   }
   catch(err) {
        res.status(400).send("Error: "+ err.message);
   }
})




module.exports = {requestRouter};