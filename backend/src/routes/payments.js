const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, paymentController.getAll);
router.post('/', authMiddleware, paymentController.create);
router.get('/:id', authMiddleware, paymentController.getOne);

module.exports = router;