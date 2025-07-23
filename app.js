const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
// ...existing code...

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/food-ordering', { useNewUrlParser: true, useUnifiedTopology: true });

// Use user routes
app.use('/users', userRoutes);

// ...existing code...
module.exports = app;
