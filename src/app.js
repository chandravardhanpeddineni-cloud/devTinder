const express = require('express');

const app = express();   //app is an instance of express js application

app.use('/user', (req, res, next) => {
    console.log("Request received at /user endpoint");
    next();  //call the next middleware function in the stack
});
app.patch('/user', (req, res) => {
   console.log("Updating user in database...");
   res.send({
    message: "User updated successfully in database"
   })
});
app.get('/user', (req, res) => {
        res.send({
            name: "John Doe",
            age: 30,
            email: "john@gmail.com"
        });
});
app.post('/user', (req, res) => {  
    console.log("Creating user in database...");
    res.send({
        message: "User created successfully in database"
    });
});


app.delete ('/user', (req, res) => {
    console.log("Deleting user from database...");
    res.send({
        message: "User deleted successfully from database"
    });
}); 


app.listen(3000,() => {
    console.log("Server is running on port 3000");
}); 