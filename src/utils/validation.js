const validator = require('validator');

const validateSignUpDate = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("Enter the first And Last Name");
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter strong password");
    }

}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "profilePicture", "bio", "age", "gender", 'skills'];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}
module.exports = {
    validateSignUpDate,
    validateEditProfileData
}