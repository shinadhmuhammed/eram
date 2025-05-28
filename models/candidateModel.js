const mongoose = require('mongoose');
const User = require('./User');

const candidateSchema = new mongoose.Schema({
    firstName:
    {
        type: String,
        required: true
    },
    lastName:
    {
        type: String,
        required: true
    },
    dateOfBirth: Date,
    gender:
    {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    currentLocation: String,
    willingToRelocate:
    {
        type: Boolean,
        default: false
    },
    noticePeriod: Number,
    currentSalary: Number,
    expectedSalary: Number,
    profileStrength:
    {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    skills: [{
        name: String,
        proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
        years: Number
    }],
    education: [{
        degree: String,
        institution: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
        isCurrent: Boolean,
        description: String
    }],
    experience: [{
        jobTitle: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        isCurrent: Boolean,
        description: String
    }],
    status: { type: String, enum: ['active', 'hired', 'inactive', 'blacklisted'], default: 'active' }
});

const Candidate = User.discriminator('Candidate', candidateSchema);
module.exports = Candidate;
