const express = require('express');
const { getCaseStudies, getCaseStudyById, createCaseStudy, updateCaseStudy, deleteCaseStudy } = require('../controllers/caseStudyController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getCaseStudies);
router.get('/:id', getCaseStudyById);
router.post('/', authenticate, authorizeAdmin, createCaseStudy);
router.put('/:id', authenticate, authorizeAdmin, updateCaseStudy);
router.delete('/:id', authenticate, authorizeAdmin, deleteCaseStudy);

module.exports = router;