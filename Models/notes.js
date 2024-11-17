const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const notesSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  packages: { type: String, required: true },
  position: { type: String, required: true },
  jobtype: { type: String, required: true },
  location: { type: String, required: true },
  expLevel: { type: String, required: true },
  questions: [{ type: String, required: true }],
  date: { type: String, required: true },
  user: { type: ObjectId, ref: "User" },
},{timestamps:true});

const Notes = mongoose.model("notes", notesSchema);

module.exports = { Notes };
