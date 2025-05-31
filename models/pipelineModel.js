const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stages: [
    {
      name: {
        type: String,
        required: true,
      },
      order: {
        type: Number, 
        required: true,
      },
      description: {
        type: String,
      },
      requiredDocuments: [
        {
          type: String,
        },
      ],
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Pipeline = mongoose.model('Pipeline', pipelineSchema);
module.exports = Pipeline;
