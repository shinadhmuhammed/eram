const mongoose = require("mongoose");

const studentJobApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workorder",
      required: true,
    },
    customFieldResponses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, 
      default: {},
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const StudentJobApplication = mongoose.model("StudentJobApplication", studentJobApplicationSchema);

module.exports = StudentJobApplication;
