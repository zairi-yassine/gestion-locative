const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },          // ex: Appartement T2 centre ville
  address: { type: String, required: true },
  rent: { type: Number, required: true },           // montant du loyer
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }, // référence vers le locataire, optionnel
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);