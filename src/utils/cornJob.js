const corn = require('node-cron');
const { subDays, startOfDay, endOfDay, } = require("date-fns");
const ConnectionRequestModel = require('../models/connectionRequest');
const sendEmail = require('./sendEmail');

// corn.schedule("20 22 * * * *", async () => {
//     //reminder who got request from the previous day
    
//     const yesterday = subDays(new Date(), 1);

//     const yesterdayStart = startOfDay(yesterday);
//     const yesterdayEnd = endOfDay(yesterday);

//     try{
//         const pendingRequests = await ConnectionRequestModel.find({
//             status: "interested",
//             createdAt: {
//                 $gte: yesterdayStart,
//                 $lt: yesterdayEnd
//             }
//         }).populate("fromUserId toUserId");

//         const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))];

//         for(const email of listOfEmails) {
//             try{
//                 const res = await sendEmail.run("New friend request pending " + email, "There are so many friend request pending please login to devTinder.in and accept or reject the request.");
//             }catch(err){
//                 console.log(err);
//             }
//         }
//     }catch(err){
//         console.log(err);
//     }
// })