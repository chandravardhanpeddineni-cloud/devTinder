const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
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
profileRouter.patch('/password', userAuthMiddleWare, async (req, res) => {
          try{
               const loggedUser = req.user;

               const { updatedPassword, updatedConfirmPassword} = req.body;
          
          if(updatedPassword != updatedConfirmPassword) {
               throw new Error("Enter the correct password!!");
          }

          if(!validator.isStrongPassword(updatedPassword)) {
               throw new Error("Please enter strong password");
          }
          
          const updatedPasswordHash = await bcrypt.hash(updatedPassword, 10);
          loggedUser.password = updatedPasswordHash

          await loggedUser.save();

          res.send({
               'message': "Password updated successfully"
          });
          }
          catch(err) {
               res.send(400).send("Error: " + err.message);
          }

})

module.exports = {profileRouter};