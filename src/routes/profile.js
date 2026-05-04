const express = require('express');
const { userAuthMiddleWare } = require('../Middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const profileRouter = express.Router();

profileRouter.get('/view', userAuthMiddleWare, async (req, res) => {
   try{
        const user = req.user;
        res.send(user);
   }
   catch(err) {
        res.status(400).send("Error: " +  err.message);
   }
})

profileRouter.patch('/edit', userAuthMiddleWare, async (req, res) => {
     try{
          if(!validateEditProfileData(req)) {
               throw new Error("Invalid Edit request");
          }

           const loggedInUser = req.user;
          
           Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])) 

           await loggedInUser.save();

           res.send({
               "message" : `updated successfully`,
               "data" : loggedInUser 
           });
     }catch(err) {
          res.status(400).send("Error: " + err.message);
     }
})

module.exports = {profileRouter};