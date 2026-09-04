const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const app = express();   //app is an instance of express js application
const cookieParser = require('cookie-parser');

const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request')
const  { userRouter } = require('./routes/user');


app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());  //middleware to parse incoming JSON data in the request body

// app.use((req, res, next) => {
//     console.log(req.body);
//     next();
// })
app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);

connectDB().then(() => {
    console.log("Connected to the database successfully");

    app.listen(3000,() => {
    console.log("Server is running on port 3000");
}); 
}).catch(err => {
    console.error("Error connecting to the database: ", err);
});
