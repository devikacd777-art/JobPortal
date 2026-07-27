const express = require('express');
const router = express.Router();
const { applyToJob, getApplicationsForJob, getMyApplications } = require('../controllers/applicationcontroller');
const protect = require('../middleware/authmiddleware');

router.post('/', protect, applyToJob);
router.get('/job/:jobId', protect, getApplicationsForJob);
router.get('/my', protect, getMyApplications);

module.exports = router;