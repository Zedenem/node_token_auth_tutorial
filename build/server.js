'use strict';

/* External Requirements */
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jsonWebToken = require('jsonwebtoken');

/* Internal Requirements */
var config = require('./config');
var User = require('./models/user');

// Load Routers
var authRouter = require('./routers/auth-router');

/* Configuration */
var app = express();
app.set('secret', config.secret);
var port = process.env.PORT || 8080;
// Set mongoose.Promise to the default ES6 Promise implementation
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev')); // Log Requests to the Console

/* Basic Routes */
app.get('/', function (req, res) {
  res.send('Welcome to this Tutorial. The API is located at <strong>/api</strong>');
});

app.get('/setup', function (req, res) {
  // Create a sample user
  var newUser = new User({
    name: 'Nick Cerminara',
    // Security flaw (beyond the obvious hard-coded stupid password):
    // passwords should be encrypted, using bcrypt for example
    password: 'password',
    admin: true
  });

  // Save the sample user
  newUser.save().then(function () {
    res.json({ success: true });
  }, function (err) {
    throw err;
  });
});

/* API Routes */
app.use('/api/auth/', authRouter);

var apiRouter = express.Router();

apiRouter.use(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jsonWebToken.verify(token, app.get('secret'), function (err, decoded) {
      if (err) {
        res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).send({ success: false, message: 'Missing token.' });
  }
});

apiRouter.get('/', function (req, res) {
  res.json({ message: 'Welcome to the coolest API on Earth!' });
});

apiRouter.get('/users', function (req, res) {
  User.find().catch(function (err) {
    return res.status(400).send(err);
  }).then(function (users) {
    return res.json(users);
  });
});

app.use('/api', apiRouter);

/* Start */
app.listen(port);
console.log('API now running on port ' + port);
//# sourceMappingURL=server.js.map