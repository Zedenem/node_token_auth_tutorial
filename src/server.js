/* External Requirements */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jsonWebToken = require('jsonwebtoken');

/* Internal Requirements */
const config = require('./config');
const User = require('./models/user');

// Load Routers
const authRouter = require('./routers/auth-router');

/* Configuration */
const app = express();
app.set('secret', config.secret);
const port = process.env.PORT || 8080;
// Set mongoose.Promise to the default ES6 Promise implementation
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

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
    // Security flaw (beyond the obvious hard-coded stupid password):
    // passwords should be encrypted, using bcrypt for example
    password: 'password',
    admin: true,
  });

  // Save the sample user
  newUser.save().then(
    () => { res.json({ success: true }); },
    (err) => { throw err; },
  );
});

/* API Routes */
app.use('/api/auth/', authRouter);

const apiRouter = express.Router();

apiRouter.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jsonWebToken.verify(token, app.get('secret'), (err, decoded) => {
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

apiRouter.get('/', (req, res) => {
  res.json({ message: 'Welcome to the coolest API on Earth!' });
});

apiRouter.get('/users', (req, res) => {
  User.find()
  .catch(err => res.status(400).send(err))
  .then(users => res.json(users));
});

app.use('/api', apiRouter);

/* Start */
app.listen(port);
console.log(`API now running on port ${port}`);
