const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    phone:
    {
        type: String,
        unique: true
    },
    passwordHash: String,
    accountStatus:
    {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active'
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],

    organization:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    lastLogin: Date,
    failedLoginAttempts:
    {
        type: Number,
        default: 0
    },
    profileCompleted:
    {
        type: Boolean,
        default: false
    },
    twoFactorEnabled:
    {
        type: Boolean,
        default: false
    }
}, {
    discriminatorKey: 'userType',
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
