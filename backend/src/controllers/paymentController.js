const Payment = require('../models/Payment');

exports.getAll = async (req, res) => {
  try {
    const payments = await Payment.find().populate('property tenant');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('property tenant');
    if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.create = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};