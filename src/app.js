const express = require('express');

const app = express();   //app is an instance of express js application

 app.use('/', (req, res) => {
    res.send("Welcome to the Dashboard of DevTinder");
 })
app.use('/hello', (req,res) => {
    res.send("Hello from the server");
});
app.use('/goodbye', (req, res) => {
    res.send('Goodbye from the server');
});
app.listen(3000,() => {
    console.log("Server is running on port 3000");
}); 