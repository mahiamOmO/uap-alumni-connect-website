const express = require('express');
const cors = require('cors');
require('dotenv').config();

const profilesRoutes = require('./routes/profiles');
const eventsRoutes = require('./routes/events');
const jobsRoutes = require('./routes/jobs');
const postsRoutes = require('./routes/posts');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'UAP Alumni Connect API',
    version: '1.0.0',
    endpoints: {
      profiles: '/api/profiles',
      events: '/api/events',
      jobs: '/api/jobs',
      posts: '/api/posts',
      dashboard: '/api/dashboard'
    }
  });
});

app.use('/api/profiles', profilesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});

module.exports = app;
