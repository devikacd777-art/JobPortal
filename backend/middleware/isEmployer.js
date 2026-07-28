const User = require('../models/User');

module.exports = async function isEmployer(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied. Employers only.' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};