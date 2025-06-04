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
    requiredSkills: {
      type: [String],
      default: [],
    },
    jobRequirements: {
      type: String,
    },
    numberOfCandidate: {
      type: Number,
      default: 1,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isCommon: {
      type: Boolean,
      default:false
    },
    benefits: {
      type: [String],
      default: [],
    },
    languagesRequired: {
      type: [String],
      default: [],
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

workorderSchema.index({ branch: 1 });
workorderSchema.index({ pipeline: 1 });
workorderSchema.index({ assignedRecruiters: 1 });
workorderSchema.index({ workOrderStatus: 1 });
workorderSchema.index({ startDate: 1 });
workorderSchema.index({ deadlineDate: 1 });

const Workorder = mongoose.model("Workorder", workorderSchema);
module.exports = Workorder;
