const express = require('express');
const Chat = require('../models/chat');
const { userAuthMiddleWare } = require('../Middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuthMiddleWare ,async (req, res) => {
    const { targetUserId} = req.params;

    const userId = req.user;

    try{
        const connection = await ConnectionRequest.findOne({
                $or: [
                    {
                        fromUserId: userId,
                        toUserId: targetUserId,
                        status: "accepted"
                    }, 
                    {
                        fromUserId: targetUserId,
                        toUserId: userId,
                        status: "accepted"
                    }
                    ]
                }
            );
            console.log("Connection:" + connection);
            if(!connection) throw new Error("There is no exisiting Connection between " + userId +" and " + targetUserId);

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId]},
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });
        if(!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            })
            await chat.save();
        }
        return res.json(chat);
    }catch(err){
        console.log(err.message);
        socket.emit("joinChatError", {
            message: err.message
        });
    }
})


module.exports = chatRouter;