/* External Requirements */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jsonWebToken = require('jsonwebtoken');

/* Internal Requirements */
const config = require('./config');
const User = require('./app/models/user');

/* Configuration */
const app = express();
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev')); // Log Requests to the Console

/* Routes */
app.get('/', (req, res) => {
  res.send('Welcome to this Tutorial. The API is located at <strong>/api</strong>');
});

app.get('/setup', (req, res) => {
  // Create a sample user
  const newUser = new User({
    name: 'Nick Cerminara',
    password: 'password',
    admin: true,
  });

  // Save the sample user
  newUser.save.then(
    (user) => { res.json({success: true}); },
    (err) => { throw err; },
  );
});

/* Start */
app.listen(port);
console.log(`API now running on port ${port}`);
