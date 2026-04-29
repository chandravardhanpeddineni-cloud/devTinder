
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        required: true,
        validate(value) {
            if(!["male", "female", "other"].includes(value.toLowerCase())) {
                throw new Error(" Invalid gender value. Allowed values are male, female, or other.");
            }
         }
    },
    profilePicture: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png"
    },
    bio: {
        type: String,
        default: "This is a default bio of the user."
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);


module.exports = User;