const mongoose = require('mongoose');
const User = require('./User');

const employeeSchema = new mongoose.Schema({
    candidateId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
    },
    organization:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization', required: true
    },
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
    branch:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    designation: String,
    department: String,
    manager:
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
    },
    joiningDate:
    {
        type: Date,
        required: true
    },
    employmentType:
    {
        type: String,
        enum: ['full-time', 'part-time', 'contract'],
        default: 'full-time'
    },
    employmentStatus:
    {
        type: String,
        enum: ['probation', 'active', 'inactive'],
        default: 'probation'
    },
    workEmail: String,
    workPhone: String,
    salary: {
        base: Number,
        bonus: Number,
        currency: { type: String, default: 'INR' }
    }
});

const Employee = User.discriminator('Employee', employeeSchema);
module.exports = Employee;
