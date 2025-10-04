const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  wallet: { type: String, required: true },
  kyc_status: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);