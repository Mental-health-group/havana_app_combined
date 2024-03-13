const BaseUser = require('./BaseUser'); // Assuming BaseUser is defined in BaseUser.js
const mongoose = require("mongoose");

// Extend the BaseUserSchema with additional fields
const professionalUserSchema = new mongoose.Schema(
    {
        ...BaseUser.schema.obj, // Merge fields from BaseUserSchema
        name: { type: String, required: true, minlength: 3, maxlength: 30 },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: { type: String, required: true,  minlength: 3, maxlength: 1024 },
        expertise: { type: String }, // Adding the expertise field
        anonymous: {
            type: Boolean,
            default: true // Set the default value to true
        }
    },
    {
        timestamps: true,
    }
);

class ProfessionalUserModel extends BaseUser {
    constructor(name, age, gender, email, profilePicture, password, expertise) {
        super(name, age, gender, email, profilePicture, password, true); // Pass true for anonymous
        this.expertise = expertise;
    }
}

module.exports = mongoose.model("professionalUserModel", professionalUserSchema);
