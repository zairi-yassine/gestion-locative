const Property = require('../models/Property');
const Tenant = require('../models/Tenant');

exports.getAll = async (req, res) => {
  try {
    const properties = await Property.find().populate('tenant');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('tenant');
    if (!property) return res.status(404).json({ message: 'Propriété non trouvée' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.create = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.update = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: 'Propriété non trouvée' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.remove = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Propriété non trouvée' });
    res.json({ message: 'Propriété supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};