const mongoose = require("mongoose");
const User = require("./User");

const employmentSchema = new Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  employmentType: {
    type: String,
    enum: ["permanent", "part-time", "contract"],
  },
  workOrderId: { type: Schema.Types.ObjectId, ref: "WorkOrder" },
  jobPostId: { type: Schema.Types.ObjectId, ref: "JobPost" },
});

const Employee = User.discriminator("Employee", employmentSchema);
module.exports = Employee;
