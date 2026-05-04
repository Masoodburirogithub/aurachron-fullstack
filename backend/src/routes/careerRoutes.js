const express = require('express');
const { getPositions, applyForPosition, createPosition, updatePosition, deletePosition } = require('../controllers/careersController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/positions', getPositions);
router.post('/apply', applyForPosition);
router.post('/positions', authenticate, authorizeAdmin, createPosition);
router.put('/positions/:id', authenticate, authorizeAdmin, updatePosition);
router.delete('/positions/:id', authenticate, authorizeAdmin, deletePosition);

module.exports = router;