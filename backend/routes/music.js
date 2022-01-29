var express = require("express")
var router = express.Router()
var music_controller = require("../controllers/music")

router.post("/createArtist", music_controller.createArtist)
router.post("/createAlbum", music_controller.createAlbum)
router.post("/createTrack", music_controller.createTrack)
router.get("/getTrack", music_controller.getTrack)
router.get("/getAlbum", music_controller.getAlbum)
router.get("/getArtist", music_controller.getArtist)

module.exports = router
