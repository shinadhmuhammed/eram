const mongoose = require("mongoose");

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
    },
  ],
  pipelineStatus: {
    type: String,
    enum: ["active", "inActive"],
    default: "active",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
});

const Pipeline = mongoose.model("Pipeline", pipelineSchema);
module.exports = Pipeline;
