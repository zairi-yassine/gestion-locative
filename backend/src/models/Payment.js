const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  amount: { type: Number, required: true },
  paidAt: { type: Date, default: Date.now },
  month: { type: String, required: true }, // ex: "2024-05"
  isPaid: { type: Boolean, default: true }
});

module.exports = mongoose.model('Payment', paymentSchema);