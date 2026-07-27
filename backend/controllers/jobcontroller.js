const Job = require('../models/Job');

// CREATE a job (employer only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      postedBy: req.userId,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all jobs (anyone can browse)
exports.getJobs = async (req, res) => {
  try {
    const { title, location, company } = req.query;
    const filter = {};

    if (title) filter.title = { $regex: title, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (company) filter.company = { $regex: company, $options: 'i' };

    const jobs = await Job.find(filter).populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET jobs posted by the logged-in recruiter
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE a job (only the recruiter who posted it)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }
    const { title, description, company, location, salary, jobType } = req.body;
    if (title) job.title = title;
    if (description) job.description = description;
    if (company) job.company = company;
    if (location) job.location = location;
    if (salary) job.salary = salary;
    if (jobType) job.jobType = jobType;
    await job.save();
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a job (only the recruiter who posted it)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    await job.deleteOne();
    res.status(200).json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};