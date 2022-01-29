const mongoose = require("mongoose")
const Artist = require("../models/artist")
const Album = require("../models/album")
const Track = require("../models/track")

exports.createArtist = function (req, res) {
  const { name, picture } = req.body
  const artist = await Artist.create({
    name,
    picture
  })
  res.send({
    message: "Artist added successfully!",
    artist
  })
}

exports.createAlbum = function (req, res) {
  const { title, release_date, cover, genre, artist } = req.body
  const album = await Album.create({
    title,
    release_date,
    cover,
    genre,
    artist
  })
  res.send({
    message: "Album added successfully!",
    album
  })
}

exports.createTrack = function (req, res) {
  const { title, release_date, duration, link, artist, album } = req.body

  let obj = { title, release_date, duration, link, artist }
  if (track) {
    obj["album"] = album
  }

  const album = await Track.create(obj)
  res.send({
    message: "Track added successfully!",
    track
  })
}

exports.getTrack = function (req, res) {
  const { id } = req.params

  const track = await Track.findOne({
    _id: mongoose.Types.ObjectId(id)
  })
    .populate("album")
    .populate("artist")

  req.send(track)
}

exports.getAlbum = function (req, res) {
  const { id } = req.params

  const album = await Album.findOne({
    _id: mongoose.Types.ObjectId(id)
  }).populate("artist")

  req.send(album)
}

exports.getArtist = function (req, res) {
  const { id } = req.params

  const artist = await Artist.findOne({
    _id: mongoose.Types.ObjectId(id)
  })
  req.send(artist)
}
