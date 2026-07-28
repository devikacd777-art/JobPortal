const Application = require('../models/Application');
const Job = require('../models/Job');

// APPLY to a job
exports.applyToJob = async (req, res) => {
  try {
   const { jobId } = req.body;
const resumeUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.userId,
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'You already applied to this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.userId,
      resumeUrl,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET applications for a specific job (employer view)
exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET my applications (job seeker view)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.userId })
      .populate('job');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.userId })
      .populate('job');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE application status (admin/employer)     ← paste starting here
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};