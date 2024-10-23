const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['patient', 'doctor'],
        default: 'patient', 
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now, 
    },
    created_By: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false,
    }
});

userSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
