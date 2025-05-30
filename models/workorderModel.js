const mongoose = require('mongoose')

const workorderSchema = mongoose.Schema({
    title: {
        type: String
    },
    clientName: {
        type: String
    },
    description: {
        type: String
    },
    priority: {
        type: String
    },
    pipeline: {
        type: String
    },
    
}, { timestamps: true })

const Workorder = mongoose.model('Workorder', workorderSchema)
module.exports = Workorder;