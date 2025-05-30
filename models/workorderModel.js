const mongoose = require("mongoose");

const workorderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    jobCode: {
      type: String,
    },
    workplace: {
      type: String,
      enum: ["WorkPlace", "Hybrid", "Remote"],
    },
    officeLocation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    jobFunction: {
      type: String,
    },
    companyIndustry: {
      type: String,
    },
    EmploymentType: {
      type: String,
    },
    Experience: {
      type: String,
    },
    priority: {
      type: String,
    },
    Education: {
      type: String,
    },
    annualSalary: {
      type: String,
    },
    pipeline: {
      type: String,
    },

    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    deadlineDate: {
      type: Date,
    },
    workOrderStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    assignedRecruiters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

const Workorder = mongoose.model("Workorder", workorderSchema);
module.exports = Workorder;
