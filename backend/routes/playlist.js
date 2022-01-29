var express = require('express')
var router = express.Router()
var playlist_controller = require('../controllers/playlist')

router.post('/createPlaylist', playlist_controller.createPlaylist)
router.get('/getPlaylist/:uid', playlist_controller.getPlaylist)
router.post('/deletePlaylist', playlist_controller.deletePlaylist)
router.post(
  '/addTrackToPlaylist',
  playlist_controller.addTrackToPlaylist
)
router.post(
  '/removeTrackFromPlaylist',
  playlist_controller.removeTrackFromPlaylist
)

module.exports = router
