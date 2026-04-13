const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  contact: String,
  history: String,
  symptoms: [String],
  doctorNotes: String,
  treatment: String
});

module.exports = mongoose.model('Patient', patientSchema);