const express = require('express');

const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();   //app is an instance of express js application



app.post('/signup', async (req, res) => {
    const userObject = {
        address: "Hyderabad, Telangana, India",
        lastName: "Peddineni",
        emailID: "akashay@example.com",
        password: "password12",
        age: 32,
        gender: "male"
    }
    //creating a new instance of the user model and passing the userObject to it
    const user = new User(userObject);

    try {
         await user.save();
        res.status(201).send(savedUser);
   
    } catch (err) {
        res.status(500).send("Error saving user: " + err);
    }
});



connectDB().then(() => {
    console.log("Connected to the database successfully");

    app.listen(3000,() => {
    console.log("Server is running on port 3000");
}); 
}).catch(err => {
    console.error("Error connecting to the database: ", err);
});
