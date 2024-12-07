const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: function() { return !this.googleId; }, 
        unique: true,
        trim: true,
        match: /^.{3,}$/,
    },
    phoneNumber: {
        type: String,
        required: function() { return !this.googleId; }, 
        trim: true,
        match: /^(03|70|71|76|80|81)\d{6}$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
        type: String,
        required: function() { return !this.googleId; }, 
    },
    dateOfBirth: {
        type: Date,
        required: function() { return !this.googleId; }, 
    },
    location: {
        type: String,
        required: function() { return !this.googleId; }, 
    },
    roles: {
        type: [String],
        required: true,
        default: ['user']
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    profilePicture: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
