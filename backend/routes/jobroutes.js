const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getMyJobs, updateJob, deleteJob } = require('../controllers/jobcontroller');
const protect = require('../middleware/authmiddleware');

router.post('/', protect, createJob);
router.get('/my', protect, getMyJobs);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;