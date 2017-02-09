const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = mongoose.model('Blacktoken', new Schema({
  token: String,
}));
