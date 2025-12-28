const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, tenantController.getAll);
router.post('/', authMiddleware, tenantController.create);
router.get('/:id', authMiddleware, tenantController.getOne);
router.put('/:id', authMiddleware, tenantController.update);
router.delete('/:id', authMiddleware, tenantController.remove);

module.exports = router;