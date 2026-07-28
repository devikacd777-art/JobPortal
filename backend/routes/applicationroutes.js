const express = require('express');
const router = express.Router();
const { applyToJob, getApplicationsForJob, getMyApplications, updateApplicationStatus } = require('../controllers/applicationcontroller');
const protect = require('../middleware/authmiddleware');
const isEmployer = require('../middleware/isEmployer');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('resume'), applyToJob);
router.get('/job/:jobId', protect, getApplicationsForJob);
router.get('/my', protect, getMyApplications);
router.put('/:id/status', protect, isEmployer, updateApplicationStatus);

module.exports = router;