const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
    permissions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Roles = mongoose.model('Role', roleSchema)
module.exports = Roles;