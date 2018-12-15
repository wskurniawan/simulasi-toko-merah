const mongoose = require('mongoose');

const Schema = mongoose.Schema({
   image: String,
   name: String,
   price: String,
   category: String,
   source: String
});

module.exports = mongoose.model('item', Schema);