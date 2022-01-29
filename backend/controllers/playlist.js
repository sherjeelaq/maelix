const Playlist = require("../models/playlist")
const User = require("../models/user")
const mongoose = require("mongoose")
const getUniqueId = require("../lib/getUniqueId")

exports.createPlaylist = async function (req, res) {
  const { playlistName, userId } = req.body

  let customPlaylist = await Playlist.create({
    name: playlistName,
    uid: await getUniqueId(),
    userId: userId,
    tracks: [],
    type: "custom"
  })

  res.send({ playlist: customPlaylist, success: true })
}

exports.getPlaylist = async function (req, res) {
  const { uid } = req.params

  const playlist = await Playlist.findOne({
    uid
  })

  if (!playlist) return res.send({ playlist: null })
  res.send({ playlist, success: true })
}

exports.deletePlaylist = async function (req, res) {
  const { uid } = req.body

  let deletedPlaylist = await Playlist.findOneAndDelete({
    uid
  })

  res.send({
    success: deletedPlaylist ? true : false
  })
}

exports.addTrackToPlaylist = async function (req, res) {
  const { playlistUid, track, userId, addToFavourite } = req.body

  let findTrack = {}

  if (addToFavourite) {
    findTrack["userId"] = mongoose.Types.ObjectId(userId)
    findTrack["type"] = "favourites"
  } else {
    findTrack["uid"] = playlistUid
  }
  const isInPlaylist = await Playlist.find({
    ...findTrack,
    "tracks.name": track.name,
    "tracks.artist.mbid": track.artist.mbid
  })

  if (!isInPlaylist || (isInPlaylist && isInPlaylist.length > 0)) {
    return res.send({
      success: false
    })
  }

  const addedToPlaylist = await Playlist.findOneAndUpdate(
    findTrack,
    {
      $addToSet: {
        tracks: track
      }
    },
    {
      new: true
    }
  )

  let favUser = null
  if (addedToPlaylist && addedToPlaylist.type === "favourites") {
    //add track to favourites array
    const latestTrack =
      addedToPlaylist.tracks[addedToPlaylist.tracks.length - 1]

    favUser = await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(userId)
      },
      {
        $addToSet: {
          favourites: {
            name: track.name,
            artist_mbid: track.artist.mbid,
            playlist_track_id: latestTrack._id
          }
        }
      },
      {
        new: true
      }
    )
  }

  let resObj = {
    playlist: addedToPlaylist,
    success: true,
    isFavourite: addedToPlaylist && addedToPlaylist.type === "favourites"
  }
  if (favUser) {
    resObj["favourites"] = favUser.favourites
  }
  res.send(resObj)
}

exports.removeTrackFromPlaylist = async function (req, res) {
  const { playlistUid, trackId, removeFromFavourite, userId, favouriteId } =
    req.body

  let findTrack = {}

  if (removeFromFavourite) {
    findTrack["userId"] = mongoose.Types.ObjectId(userId)
    findTrack["type"] = "favourites"
  } else {
    findTrack["uid"] = playlistUid
  }

  const removedFromPlaylist = await Playlist.findOneAndUpdate(
    findTrack,
    {
      $pull: {
        tracks: {
          _id: mongoose.Types.ObjectId(trackId)
        }
      }
    },
    {
      new: true
    }
  )

  let updatedUser = null
  if (
    removeFromFavourite ||
    (removedFromPlaylist && removedFromPlaylist.type === "favourites")
  ) {
    let updateObj = {}

    if (removeFromFavourite) {
      updateObj = {
        $pull: {
          favourites: {
            _id: mongoose.Types.ObjectId(favouriteId)
          }
        }
      }
    } else if (removedFromPlaylist) {
      updateObj = {
        $pull: {
          favourites: {
            playlist_track_id: trackId
          }
        }
      }
    }

    updatedUser = await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(userId)
      },
      updateObj,
      {
        new: true
      }
    )
  }

  let resObj = {
    playlist: removedFromPlaylist,
    success: true,
    isFavourite: removeFromFavourite
  }
  if (removeFromFavourite && updatedUser) {
    resObj["favourites"] = updatedUser.favourites
  }

  res.send(resObj)
}
