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

/* Basic Routes */
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

/* API Routes */
const apiRouter = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
// TODO: route middleware to verify a token

apiRouter.get('/', (req, res) => {
  res.json({ message: 'Welcome to the coolest API on Earth!' });
});

apiRouter.get('/users', (req, res) => {
  User.find().then(
    (users) => { res.json(users); },
    (err) => { throw err; },
  );
});

app.use('/api', apiRouter);

/* Start */
app.listen(port);
console.log(`API now running on port ${port}`);
