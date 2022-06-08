const mongoose = require('mongoose')

const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  initials: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin