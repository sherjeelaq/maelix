const Playlist = require('../models/playlist')

async function getUniqueId() {
  let id
  let isNotUnique = true
  while (isNotUnique) {
    id = Buffer.from(Math.random().toString())
      .toString('base64')
      .substring(6, 22)
    let check = await Playlist.countDocuments({
      uid: id
    })
    if (!check || (check && check <= 0)) {
      isNotUnique = false
    }
  }
  return id
}

module.exports = getUniqueId
