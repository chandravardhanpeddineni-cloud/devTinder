const express = require('express');

const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();   //app is an instance of express js application

app.use(express.json());  //middleware to parse incoming JSON data in the request body

app.post('/signup', async (req, res) => {

    const user = new User(req.body);

    try {
        
         await user.save(); 
        res.status(201).send("User created successfully");
   
    } catch (err) {
        res.status(500).send("Error saving user: " + err);
    }
});



//get user details by email

app.get('/user', async(req, res) => {
    const userEmail = req.body.emailId;

     try{
        const users = await User.find({ emailId: userEmail });
        if(users.length === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(users);
     }
     catch(err) {
        res.status(500).send("Error fetching user details: " + err);
     }

})
//Feed API - GET /feed - to get the list of users in the feed
app.get('/feed', async(req, res) => {
    
    try {
        // const users = await User.findOne({});  //if we sent the empty {} then it will return the latest user in the database
        // if(users?.length === 0) {
        //     return res.status(404).send("No users found in the feed");
        // }
        const users = await User.find({}); 
        if(users.length === 0) {
            return res.status(404).send("No users found in the feed");
        }
        res.status(200).send(users);
    }catch(err) {
        res.status(500).send("Error fetching feed: " + err);
    }
})

//Delete user API - DELETE /user - to delete a user by their ID
app.delete('/user', async(req, res) => {
    const userId = req.body.userId;

    try{
        const deleteUser = await User.findByIdAndDelete(userId);
        // if(!deleteUser) {
        //     return res.status(404).send("User not found");
        // }
        res.status(200).send("User deleted successfully");
    }
    catch(err) {
        res.status(500).send("Error deleting user: " + err);
    }
})

//Update user API - PATCh /user - to update a user's details
app.patch('/user/:userId', async(req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "userId", "profilePicture", "about", "gender", "age", "skills", "password"
        ];

        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
        
        if(!isUpdateAllowed) {
            throw new Error("Update is not Allowed");
        }

        if(data?.skills.length > 10) {
            throw new Error("Skills can't be more than 10");
        }

        const updateUser = await User.findByIdAndUpdate(userId, data, 
            {
                returnDocument: "After", 
                runValidators: true
            });
        if(!updateUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).send("User updated successfully");
    }
    catch(err) {
        res.status(500).send("Error updating user: " + err.message);
    }
})

connectDB().then(() => {
    console.log("Connected to the database successfully");

    app.listen(3000,() => {
    console.log("Server is running on port 3000");
}); 
}).catch(err => {
    console.error("Error connecting to the database: ", err);
});
