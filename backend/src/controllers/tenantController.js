const Tenant = require('../models/Tenant');

exports.getAll = async (req, res) => {
  try {
    const tenants = await Tenant.find().populate('property');
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate('property');
    if (!tenant) return res.status(404).json({ message: 'Locataire non trouvé' });
    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.create = async (req, res) => {
  try {
    const tenant = await Tenant.create(req.body);
    res.status(201).json(tenant);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.update = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tenant) return res.status(404).json({ message: 'Locataire non trouvé' });
    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.remove = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Locataire non trouvé' });
    res.json({ message: 'Locataire supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};