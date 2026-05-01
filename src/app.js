const express = require('express');

const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();   //app is an instance of express js application
const { validateSignUpDate } = require('./utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const { userAuthMiddleWare } = require('./Middlewares/auth')
app.use(cookieParser());
app.use(express.json());  //middleware to parse incoming JSON data in the request body




app.post('/signup', async (req, res) => {
    
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


app.post('/login', async (req, res) => {

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

app.get('/profile', userAuthMiddleWare, async (req, res) => {
   try{
        const user = req.user;
        res.send(user);
   }
   catch(err) {
        res.status(400).send("Error: " +  err.message);
   }

})

app.post("/sendConnectionReq", userAuthMiddleWare ,async (req, res) => {
    
    const { firstName } = req.user;
    //sending connection request

    res.send(firstName + " send connection request");
})


connectDB().then(() => {
    console.log("Connected to the database successfully");

    app.listen(3000,() => {
    console.log("Server is running on port 3000");
}); 
}).catch(err => {
    console.error("Error connecting to the database: ", err);
});
