const mongoose = require('mongoose')
const user = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: {
    google: String
  },
  name: String,
  avatar: {
    type: String,
    default: null
  },
  onboarded: {
    type: Boolean,
    default: false
  },
  favourites: [
    {
      name: String,
      artist_mbid: String,
      playlist_track_id: String
    }
  ]
})

module.exports = mongoose.model('User', user)
