const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  prefix: {
    type : String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inActive"],
    default: "active",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
