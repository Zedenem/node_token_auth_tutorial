/* External Requirements */
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

/* Internal Requirements */
const config = require('./config');

// Load Routers
const authRouter = require('./routers/auth-router');
const apiRouter = require('./routers/api-router');

/* Configuration */
const app = express();
app.set('secret', config.secret);
// Set mongoose.Promise to the default ES6 Promise implementation
// TODO: Use bluebird instead of global for performance purposes
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log Requests to the Console
app.use(morgan('dev'));

/* Basic Routes */
app.get('/', (req, res) => {
  res.send('Welcome to this Tutorial. The API is located at <strong>/api</strong>');
});

/* API Routes */
app.use('/api/auth/', authRouter);
app.use('/api/', apiRouter);

/* Start */
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`API now running on port ${port}`);
