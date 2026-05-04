const express = require('express');

const connectDB = require('./config/database');
const app = express();   //app is an instance of express js application
const cookieParser = require('cookie-parser');

const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request')


app.use(cookieParser());
app.use(express.json());  //middleware to parse incoming JSON data in the request body


app.use('/user', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);


connectDB().then(() => {
    console.log("Connected to the database successfully");

    app.listen(3000,() => {
    console.log("Server is running on port 3000");
}); 
}).catch(err => {
    console.error("Error connecting to the database: ", err);
});
