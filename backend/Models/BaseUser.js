const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

class BaseUser {
    constructor(name, age, gender, email, profilePicture, password, anonymous) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.email = email;
        this.profilePicture = profilePicture;
        this.password = password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.anonymous = anonymous;
    }

    async comparePassword(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    }
}

const BaseUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true, // Make the email field unique
            minlength: 3,
            maxlength: 30,
        },
        profilePicture: {
            type: String
        },
        password: {
            type: String,
            required: true,
            minlength: 3, maxlength: 1024
        },
        anonymous: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('BaseUser', BaseUserSchema);
