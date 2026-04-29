
const mongoose = require('mongoose');
const validator = require('validator')
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
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Email Address: "+ value);
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("requirement must match { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}")
            }
        }
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
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid URL");
            }
         }
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