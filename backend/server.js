const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
//git push trial data
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Job Portal API running'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobroutes'));
app.use('/api/applications', require('./routes/applicationroutes'));
app.use('/api/admin', require('./routes/adminroutes'));
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));