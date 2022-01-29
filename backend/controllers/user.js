var User = require('../models/user')
var Playlist = require('../models/playlist')
const getUniqueId = require('../lib/getUniqueId')
const passport = require('passport')
var bcrypt = require('bcryptjs')

exports.login = function (req, res) {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err
    if (!user)
      res.send({
        error: 'Username not found!'
      })
    else {
      req.login(user, async err => {
        if (err) throw err

        const playlists = await Playlist.find({
          userId: user._id
        })
        let tempUser = { ...user._doc }
        delete tempUser['password']
        res.send({
          user: {
            ...tempUser,
            playlists
          }
        })
      })
    }
  })(req, res)
}

exports.register = function (req, res) {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) throw err
    if (doc) res.send('User already exists')
    if (!doc) {
      const hashedPass = await bcrypt.hash(req.body.password, 10)

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass
      })

      await newUser.save()
      res.send('User created')
    }
  })
}

exports.loginWithGoogle = async function (req, res) {
  let { id, name, email, username, photo } = req.body
  let user = await User.findOne({ email })
  if (user) {
    const playlists = await Playlist.find({
      userId: user._id
    })
    user = { ...user._doc }
    delete user['password']
    user = {
      ...user,
      playlists
    }

    if (user.token && user.token.google && user.token.google === id) {
      res.send({
        user: user
      })
    } else {
      let updateUser = await User.findOneAndUpdate(
        { email },
        {
          token: {
            google: id
          }
        },
        {
          upsert: true
        }
      )
      res.send({
        user: updateUser
      })
    }
  } else {
    const newUser = await User.create({
      username,
      email,
      name,
      avatar: photo,
      token: {
        google: id
      }
    })

    res.send({
      user: newUser
    })
  }
}

exports.completeOnboarding = async function (req, res) {
  const { name, username, onboarded } = req.body

  if (!req.query) return res.sendStatus(400)

  const { _id } = req.query

  await User.findByIdAndUpdate(
    _id,
    {
      name,
      username,
      onboarded
    },
    {
      upsert: true
    }
  )
    .then(async user => {
      let recentPlaylist = await Playlist.create({
        name: 'Recently Played',
        uid: await getUniqueId(),
        userId: user._id,
        tracks: [],
        type: 'recently_played'
      })
      let favPlaylist = await Playlist.create({
        name: 'Favourites',
        uid: await getUniqueId(),
        userId: user._id,
        tracks: [],
        type: 'favourites'
      })
      res.send({
        success: true,
        playlists: [recentPlaylist, favPlaylist]
      })
    })
    .catch(e => {
      console.log('Error: ', e)

      res.sendStatus(400)
    })
}

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/')
}
