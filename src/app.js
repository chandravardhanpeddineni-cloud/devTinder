const express = require('express');

const app = express();   //app is an instance of express js application

//Handle auth middleware for admin routes
const { adminAuthMiddleware, userAuthMiddleWare } = require('./Middlewares/auth');

// Apply the admin authentication middleware to all routes starting with /admin
app.use('/admin', adminAuthMiddleware);

app.get('/admin/dashboard', (req, res) => {
    //we need to check if the user is authenticated and has the role of admin
    res.send("Welcome to the admin dashboard");
});

app.get('/admin/delete-user', (req, res) => {
    res.send("User deleted successfully");
}) 


// Apply the user authentication middleware to all routes starting with /user
app.use('/user', userAuthMiddleWare);

app.get('/user',userAuthMiddleWare, (req, res) => {
    res.send("Welcome to the user page");
})


app.listen(3000,() => {
    console.log("Server is running on port 3000");
}); 