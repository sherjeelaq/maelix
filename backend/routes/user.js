var express = require("express")
var router = express.Router()
var user_controller = require("../controllers/user")

router.post("/login", user_controller.login)
router.post("/loginWithGoogle", user_controller.loginWithGoogle)
router.post("/register", user_controller.register)
router.post("/completeOnboarding", user_controller.completeOnboarding)
router.get("/logout", user_controller.logout)

module.exports = router
