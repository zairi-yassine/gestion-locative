const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');
// Ajouter middleware d'authentification si tu veux sécuriser les routes


// Toutes les propriétés requièrent d’être authentifié pour y accéder :
router.get('/', authMiddleware, propertyController.getAll);
router.post('/', authMiddleware, propertyController.create);
router.get('/:id', authMiddleware, propertyController.getOne);
router.put('/:id', authMiddleware, propertyController.update);
router.delete('/:id', authMiddleware, propertyController.remove);

module.exports = router;