// Import Dependencies
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

//Route Imports
const facultyApi = require('./routes/faculty');
const signInApi = require('./routes/signin');
const collegeApi = require('./routes/college');

app.use(morgan('tiny')); // Custom logging of requests
app.use(helmet()); // Sanitization of requests
app.use(express.json()); // Parsing requests as in JSON format

//Use CORS
app.use(cors());


// Database URL
const dbUrl =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_ADDRESS
    : process.env.DB_ADDRESS;

// Connect to database
mongoose.connect(dbUrl, { useNewUrlParser: true });
mongoose.set('debug', true);

const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB Error: '));
conn.on('connected', () => {
  console.log('Connected To Database...');
});

// mongoose.connect('mongodb://127.0.0.1:27017/SEN-BACKEND', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// })

//API Routes
app.use('/api/faculty', facultyApi);
app.use('/api/signin', signInApi);
app.use('/api/college', collegeApi);

// Error handling
app.use((req, res) => {
  res.status(500).json({ message: 'Server Error, Something Broke' });
});

module.exports = app;
