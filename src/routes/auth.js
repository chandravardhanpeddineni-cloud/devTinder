const express = require('express');
const { validateSignUpDate } = require('../utils/validation');
const User = require('../models/user'); 
const bcrypt = require('bcrypt');
const validator = require('validator');
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    
    //encrypt the password and store the data

    try {
        //Validation of data is required
        validateSignUpDate(req);

        const {firstName, lastName, emailId, password, age, gender, profilePicture, bio, skills } = req.body;

        //encrypt the password and store the data

        //below getSalt method we use generate salt string when we use hash it generated automatically

        // const salt = bcrypt.genSalt(10, function(err, salt) {
        //     console.log(salt);
        // })

        const passwordHash = await bcrypt.hash(password, 10);
        
        const user = new User({
            firstName, 
            lastName, 
            emailId, 
            password: passwordHash, 
            age, gender, 
            profilePicture, 
            bio, skills
        });

         await user.save(); 
        res.status(201).send("User created successfully");
   
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

authRouter.post('/login', async (req, res) => {

    try{
        const { emailId, password } = req.body;

        if(!validator.isEmail(emailId)) {
            throw new Error("Please enter the valid Email Id");
        }
        
        const user = await User.findOne({emailId: emailId});
        
        // console.log("user:  "+ user);
        if(!user) {
            throw new Error("Invalid Credentials");
        } 
        
        const isPasswordValid = await user.validatePassword(password);
        
        if(isPasswordValid) {

            const token = await user.getJWT();

        
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000 )});

            const { firstName } = user;
            res.send("Welcome back " + firstName);
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err) {
        res.status(500).send("Error: " + err.message);
    }

});

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
    })
    res.send("Logout Successfully");
})


module.exports = {authRouter};