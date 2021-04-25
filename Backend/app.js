require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');

require('./config/database');

const app = express();
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use((req, res, next) => {
    req.store = {};
    next();
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profil', require('./routes/profilRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

app.use((req, res) => {
    res.status(404).end(req.originalUrl);
});

module.exports = app;
