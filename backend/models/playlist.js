const mongoose = require('mongoose')

const playlist = new mongoose.Schema({
  name: String,
  uid: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['recently_played', 'favourites', 'custom']
  },
  tracks: [
    {
      name: {
        type: String,
        required: true
      },
      artist: {
        name: String,
        mbid: String
      },
      coverImage: String,
      duration: Number,
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Playlist', playlist)
