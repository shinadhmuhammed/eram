const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    workOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workorder",
      required: true,
    },
    resume: {
      type: String, 
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ["submitted", "in-review", "shortlisted", "interview", "rejected", "hired"],
      default: "submitted",
    },
    notes: {
      type: String,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ applicant: 1, workOrder: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
