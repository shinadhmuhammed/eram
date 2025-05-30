const mongoose = require('mongoose')

const pipelineSchema = mongoose.Schema({
    name:{
        type:String
    },
    description: {
        type:String
    }
})

const Pipeline = mongoose.model('Pipeline',pipelineSchema)
module.exports = Pipeline;