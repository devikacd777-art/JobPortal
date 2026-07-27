require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const existingAdmin = await User.findOne({ email: 'admin@jobportal.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('Admin123456', 10);

    await User.create({
      name: 'Admin',
      email: 'admin@jobportal.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin account created successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();