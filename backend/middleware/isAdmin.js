const User = require('../models/User');

module.exports = async function isAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    req.user = user; // now available to any route after this middleware
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};