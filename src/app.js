const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const app = express();   //app is an instance of express js application
const cookieParser = require('cookie-parser');
const http = require('http');
require("dotenv").config();


const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request')
const  { userRouter } = require('./routes/user');
const paymentRouter = require('./routes/payment');
const initializeSocket = require('./utils/socket');
const chatRouter = require('./routes/chat');

require('./utils/cornJob');

console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());  //middleware to parse incoming JSON data in the request body


app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);
app.use('/', paymentRouter);
app.use('/', chatRouter);

const server = http.createServer(app);

initializeSocket(server);

connectDB().then(() => {
    console.log("Connected to the database successfully");

    server.listen(3000,() => {
    console.log("Server is running on port 3000");
}); 
}).catch(err => {
    console.error("Error connecting to the database: ", err);
});
