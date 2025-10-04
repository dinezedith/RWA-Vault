const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  wallet: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: Boolean, default: false }
});

module.exports = mongoose.model("Invoice", invoiceSchema);
