const express = require('express');
const { userAuthMiddleWare } = require('../Middlewares/auth');
const userRouter = express.Router();
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
const USER_SAFE_DATA =  "firstName lastName profilePicture age gender bio skills";
//get all the pending connection request for the loggin user 
userRouter.get('/requests/received', userAuthMiddleWare,async (req, res) => {
    try{
        const loggInUser = req.user;
        const connectionReqs = await ConnectionRequestModel.find({
            toUserId: loggInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA); 
        // }).populate("fromUserId", ["firstName", "lastName"]); 

        if(connectionReqs.length == 0) {
            return res.status(200).json({
                message: "You have no connection requests yet.",
                data: []
            });
        }
        res.json({message: "Data fetch successfully", data: connectionReqs});
    }
    catch(err) {
        res.status(400).send("Error" + err.message);
    }
}); 

userRouter.get("/connections", userAuthMiddleWare, async(req, res) => {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({
        $or: [
            {fromUserId: loggedInUser._id, status: "accepted"},
            {toUserId: loggedInUser._id, status: "accepted" }
        ],
        // status: "accepted"    //we can write the status over here remove in $or
    }).populate("toUserId", USER_SAFE_DATA).populate("fromUserId", USER_SAFE_DATA);;




    const data = connections.map(row => {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return row.toUserId;
        }
        return row.fromUserId;
    });

    res.json(data);
    
});


userRouter.get('/feed', userAuthMiddleWare, async(req, res) => {
    try{

        const loggInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
    
        limit = limit > 50 ? 50 : limit;
        

        const connectionReq = await ConnectionRequestModel.find({
            $or: [
                {fromUserId: loggInUser._id},
                {toUserId: loggInUser._id}
            ]
        }).select("fromUserId toUserId");
 
        const hideUsersFromFeed = new Set();

        connectionReq.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString()),
            hideUsersFromFeed.add(req.toUserId.toString())
        });

        const users = await User.find({
           $and: [{ _id: { $nin: Array.from(hideUsersFromFeed) }}, { _id: {$ne: loggInUser._id} }]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({
            message: "Data fetch successfully ",
            usersData: users
        });
    }
    catch(err) {
        res.status(400).json({ message: err.message });
    }
}); 

module.exports = { userRouter };