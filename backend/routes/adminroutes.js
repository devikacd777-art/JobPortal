const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User');
const Job = require('../models/Job');

// Every route below first checks login (auth), then checks admin role (isAdmin)
router.use(auth, isAdmin);

// 1. Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Block or unblock a user
router.patch('/users/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json(user);
  } catch (err) {
    res.json({ ...user._doc, password: undefined });
  }
});

// 3. Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Get all job postings
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. Delete any job posting
router.delete('/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;