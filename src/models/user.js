const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
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
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUES} is not a valid gender`
        }
        // validate(value) {
        //     if(!["male", "female", "other"].includes(value.toLowerCase())) {
        //         throw new Error(" Invalid gender value. Allowed values are male, female, or other.");
        //     }
        //  }
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


userSchema.index({firstName: 1, lastName: 1});   // 

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;  
    const passwordHash = user.password;

    const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;

}   

userSchema.methods.getJWT = async function() {

    const user = this;

    const token = jwt.sign({_id : user._id}, "DEV@Tinder@1333",{
        expiresIn: "7d"
    });
    return token;
}

const User = mongoose.model('User', userSchema);


module.exports = User;