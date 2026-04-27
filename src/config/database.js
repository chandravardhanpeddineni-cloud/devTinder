const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect('mongodb+srv://chandravardhanpeddineni_db_user:Ramanamma%4012@cluster0.jgatkcz.mongodb.net/devTinder')
}


module.exports = connectDB;

