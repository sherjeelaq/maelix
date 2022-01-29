import React, { useState, useEffect, useMemo } from 'react'
import './Player.css'
import {
  FaStepBackward,
  FaPlay,
  FaStepForward,
  FaPause
} from 'react-icons/fa'
import { FiShuffle, FiRepeat } from 'react-icons/fi'
import {
  FaVolumeUp,
  FaVolumeMute,
  FaRegHeart,
  FaHeart
} from 'react-icons/fa'
import { MdPlaylistAdd } from 'react-icons/md'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Slider,
  Tooltip
} from '@material-ui/core'
import WaveSurfer from 'wavesurfer.js'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import getRoyaltyFreeSongs from 'helpers/getRoyaltyFreeSongs'
import Sound from 'assets/1.mp3'
import { Spinner, Button, Image } from 'components'
import { addTrackToPlaylist } from 'actions/playlist'
import { Api, env } from 'lib'
import { removeTrackFromPlaylist } from 'store/actions/playlist'
import Placeholder from 'assets/placeholders/placeholder-image.webp'

let wavesurfer
function Player() {
  const { screenDimensions } = useSelector(state => state.appState)
  const {
    state: playerState,
    list: playerList,
    active: playlistActive
  } = useSelector(state => state.player)
  const {
    _id: userId,
    playlists,
    favourites
  } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [tempSliderValue, setTempSliderValue] = useState(100)
  const [sliderValue, setSliderValue] = useState(100)
  const [currentSong, setCurrentSong] = useState(0)
  const [addToPlaylistModal, setAddToPlaylistModal] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState('none')
  const [shuffle, setshuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [paused, setPaused] = useState(true)
  const [mute, setMute] = useState(false)
  const [heart, setHeart] = useState(false)
  const [favouriteObj, setFavouriteObj] = useState(null)
  const [heartLoading, setHeartLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [songs, setSongs] = useState([
    {
      link: Sound
    }
  ])

  const isMobile = useMemo(() => {
    return (
      screenDimensions && screenDimensions.width <= env.SCREEN_WIDTH
    )
  }, [screenDimensions])

  useEffect(() => {
    setCurrentSong(0)
  }, [songs])

  useEffect(() => {
    //add playing track to recentyl played
    const song = songs[currentSong]
    if (song && song.name) {
      addToPlaylist({ type: 'addToRecentlyPlayed' })
    }
  }, [currentSong, songs])

  useEffect(() => {
    if (
      favourites &&
      favourites.length > 0 &&
      songs &&
      songs.length > 0
    ) {
      const song = songs[currentSong]

      if (!song) return
      const favourited = favourites.find(
        fav =>
          fav?.name === song.name &&
          fav?.artist_mbid === song?.artist?.mbid
      )
      setHeart(favourited ? true : false)

      setFavouriteObj(favourited)
    } else {
      setHeart(false)
    }
  }, [favourites, songs, currentSong])

  useEffect(() => {
    async function setTracks() {
      let tempTracks = await getRoyaltyFreeSongs(playerList)
      setCurrentSong(0)
      setSongs(tempTracks)
      wavesurfer?.load(tempTracks[0]?.link)
      wavesurfer?.on('ready', function () {
        wavesurfer.play()
      })
    }
    if (playerList && playerList.length > 0) {
      setTracks()
    } else {
      wavesurfer?.on('ready', function () {
        wavesurfer.play()
      })
    }
  }, [playerList])

  useEffect(() => {
    if (playerState === 'pause') {
      setPaused(false)
    } else if (playerState === 'play') {
      setPaused(true)
    }
    wavesurfer?.playPause()
  }, [playerState, wavesurfer])

  const handleVolumeChange = (event, newValue) => {
    setSliderValue(newValue)
    setMute(false)
    if (newValue === 0) {
      setMute(true)
    }
    setTempSliderValue(newValue / 100)
    wavesurfer.setVolume(newValue / 100)
  }

  function initPlayer(play) {
    wavesurfer = WaveSurfer.create({
      container: document.querySelector('#waveform'),
      barWidth: 2,
      barHeight: 0.8, // the height of the wave
      barRadius: 3,
      cursorWidth: 0.3,
      height: 40,
      responsive: true,
      barGap: 1,
      hideScrollbar: true,
      waveColor: '#67cbf8',
      progressColor: '#03a9f4'
    })

    wavesurfer.on('pause', function () {
      setPaused(true)
      wavesurfer.params.container.style.opacity = 0.6
    })
    wavesurfer.on('play', function () {
      setPaused(false)
      wavesurfer.params.container.style.opacity = 1
    })

    if (play) {
      setPaused(false)
      wavesurfer.on('ready', function () {
        wavesurfer.play()
      })
    } else {
      setPaused(true)
    }
  }

  useEffect(() => {
    let hasSongs =
      songs &&
      songs.length > 0 &&
      songs[currentSong] &&
      songs[currentSong].link
    setLoading(true)
    resetPlayer()
    initPlayer(hasSongs && songs[currentSong].name ? true : false)

    if (hasSongs) {
      wavesurfer.load(songs[currentSong].link)
      wavesurfer.on('ready', function () {
        setLoading(false)
      })
    }
  }, [currentSong])

  useEffect(() => {
    wavesurfer.un('finish', onSongFinished)
    wavesurfer.on('finish', onSongFinished)
  }, [currentSong])

  function onSongFinished() {
    setLoading(true)

    let nextindex = currentSong + 1
    resetPlayer()
    initPlayer()

    if (repeat) {
      toast.info('Repeating', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })

      wavesurfer.load(songs[currentSong].link)
      wavesurfer.on('ready', function () {
        setLoading(false)
        wavesurfer.play()
      })
    } else if (shuffle) {
      shuffleSong()
    } else if (songs[nextindex] !== undefined && !repeat) {
      toast.info('Next song playing', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      setCurrentSong(currentSong + 1)
      wavesurfer.load(songs[nextindex].link)
      wavesurfer.on('ready', function () {
        setLoading(false)
        wavesurfer.play()
      })
    } else {
      toast.info('First song playing', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      setCurrentSong(0)
      wavesurfer.load(songs[0].link)
      wavesurfer.on('ready', function () {
        setLoading(false)
        wavesurfer.play()
      })
    }

    wavesurfer.un('finish', onSongFinished)
    wavesurfer.on('finish', onSongFinished)
  }

  const playAudio = () => {
    if (paused) {
      setPaused(false)
    } else {
      setPaused(true)
    }
    wavesurfer.playPause()
  }

  const muteAudio = () => {
    if (mute) {
      setMute(false)
      wavesurfer.setMute(false)
      setSliderValue(tempSliderValue)
    } else {
      setMute(true)
      wavesurfer.setMute(true)
      setTempSliderValue(sliderValue)
      setSliderValue(0)
    }
  }

  const shuffleSong = () => {
    toast.info('Shuffling a song', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    })

    var number = Math.floor(Math.random() * songs.length)
    while (number === currentSong) {
      number = Math.floor(Math.random() * songs.length)
    }
    setCurrentSong(number)
    wavesurfer.load(songs[number].link)
    wavesurfer.on('ready', function () {
      setLoading(false)
      wavesurfer.play()
    })
  }

  const playPreviousSong = () => {
    const index = currentSong - 1
    if (shuffle) {
      shuffleSong()
    } else if (songs[index] === undefined) {
      toast.info('First song playing!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    } else {
      setCurrentSong(index)
      resetPlayer()
      wavesurfer.load(songs[index].link)
      wavesurfer.on('ready', function () {
        wavesurfer.play()
      })
    }
  }

  const playNextSong = () => {
    const index = currentSong + 1
    if (shuffle) {
      shuffleSong()
    } else if (songs[index] === undefined) {
      toast.info('Last song playing!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    } else {
      setCurrentSong(index)
      resetPlayer()

      wavesurfer.load(songs[index].link)
      wavesurfer.on('ready', function () {
        wavesurfer.play()
      })
    }
  }

  const repeatSong = () => {
    if (repeat) {
      setRepeat(false)
    } else {
      setRepeat(true)
    }
  }

  const shuffleSongs = () => {
    if (shuffle) {
      setshuffle(false)
    } else {
      setshuffle(true)
    }
  }

  const heartAction = () => {
    if (heart) {
      setHeartLoading(true)

      dispatch(
        removeTrackFromPlaylist({
          data: {
            removeFromFavourite: true,
            userId,
            favouriteId: favouriteObj._id,
            trackId: favouriteObj.playlist_track_id
          },
          action: async () => {
            setHeartLoading(false)

            if (
              playlistActive &&
              playlistActive.type === 'playlist' &&
              playlistActive.state.name === 'Favourites'
            ) {
              const res = await Api.get(
                `/playlist/getPlaylist/${playlistActive.state.uid}`
              )
              dispatch({
                type: 'SET_PLAYER_LIST',
                payload: res.playlist.tracks
              })
            }
            toast.success(
              `${favouriteObj.name} removed successfully!`,
              {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
              }
            )
          }
        })
      )

      setHeart(false)
    } else {
      setHeartLoading(true)
      const song = songs[currentSong]

      if (!song || !song.name || !song.artist) {
        toast.error('Please select a song to add to playlist!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
        setHeartLoading(false)

        return
      }

      const addData = {
        addToFavourite: true,
        userId: userId,
        track: {
          name: song?.name,
          artist: {
            name: song?.artist?.name,
            mbid: song?.artist?.mbid
          },
          coverImage: song.coverImage,
          duration: parseInt(song.duration ? song.duration : 0)
        }
      }
      dispatch(
        addTrackToPlaylist({
          data: addData,
          failAction: () => {
            setHeartLoading(false)
            toast.error('Song already favourited.', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
            })
          },
          action: () => {
            setHeartLoading(false)
            toast.success('Successfully added to Favourites.', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
            })
          }
        })
      )
      setHeart(true)
    }
  }

  const showAddToPlaylistModal = () => {
    setAddToPlaylistModal(!addToPlaylistModal)
  }

  const addToPlaylist = ({ type }) => {
    dispatch({
      type: 'LOADING_BUTTON',
      payload: 'addingTrackToPlaylist'
    })
    if (
      (!selectedPlaylist ||
        (selectedPlaylist && selectedPlaylist === 'none')) &&
      type !== 'addToRecentlyPlayed'
    ) {
      toast.error('No playlist selected!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      dispatch({
        type: 'LOADING_BUTTON',
        payload: null
      })
    } else {
      const selectedSong = songs[currentSong]

      //correct song
      if (selectedSong && selectedSong.name) {
        let playlistToAddTo =
          type && type === 'addToRecentlyPlayed'
            ? playlists.find(
                p => p.type && p.type === 'recently_played'
              ).uid
            : selectedPlaylist
        const addData = {
          playlistUid: playlistToAddTo,
          userId: userId,
          track: {
            name: selectedSong?.name,
            artist: {
              name: selectedSong?.artist?.name,
              mbid: selectedSong?.artist?.mbid
            },
            coverImage: selectedSong.coverImage
              ? selectedSong.coverImage
              : selectedSong.artist && selectedSong.artist.imageUrl
              ? selectedSong.artist.imageUrl
              : '',
            duration: parseInt(
              selectedSong.duration ? selectedSong.duration : 0
            )
          }
        }
        dispatch(
          addTrackToPlaylist({
            data: addData,
            failAction: () => {
              dispatch({
                type: 'LOADING_BUTTON',
                payload: null
              })
              if (type && type === 'addToRecentlyPlayed') return
              toast.error('Song already in playlist.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
              })
            },
            action: () => {
              dispatch({
                type: 'LOADING_BUTTON',
                payload: null
              })
              if (type && type === 'addToRecentlyPlayed') return

              toast.success('Successfully added to playlist.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
              })
              setAddToPlaylistModal(false)
            }
          })
        )
      }
      // dummmy song
      else {
        toast.warn('No song selected!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
        dispatch({
          type: 'LOADING_BUTTON',
          payload: null
        })
      }
    }
  }

  const handleSelectedPlaylist = item => {
    setSelectedPlaylist(item)
  }

  const resetPlayer = () => {
    let tempWave = document.querySelector('wave')
    tempWave && tempWave.remove && tempWave.remove()
  }

  return (
    <React.Fragment>
      <div className={`player ${isMobile ? 'player--mobile' : ''}`}>
        <div
          className={`player__left ${
            isMobile ? 'player__left--mobile' : ''
          }`}
        >
          <div className='player__songInfo'>
            <Image
              src={
                songs[currentSong] && songs[currentSong].name
                  ? songs[currentSong].coverImage
                    ? songs[currentSong].coverImage
                    : songs[currentSong].artist &&
                      songs[currentSong].artist.imageUrl
                    ? songs[currentSong].artist.imageUrl
                    : Placeholder
                  : Placeholder
              }
              alt={
                songs[currentSong] && songs[currentSong].name
                  ? songs[currentSong].name
                  : 'None'
              }
            />
            <div className='player__infoText'>
              <h4>
                {songs[currentSong] && songs[currentSong].name
                  ? songs[currentSong].name
                  : '-'}
              </h4>
              <p>
                {songs[currentSong] &&
                songs[currentSong].artist &&
                songs[currentSong].artist.name
                  ? songs[currentSong].artist.name
                  : '-'}
              </p>
            </div>
          </div>
          {isMobile && (
            <div className='player__mobileIcons'>
              {!paused ? (
                <Tooltip title='Pause' placement='top'>
                  <div
                    className='player__icon--mobile'
                    onClick={playAudio}
                  >
                    <FaPause className='player__playIcon' />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title='Play' placement='top'>
                  <div
                    className='player__icon--mobile'
                    onClick={playAudio}
                  >
                    <FaPlay className='player__playIcon' />
                  </div>
                </Tooltip>
              )}
              {heartLoading ? (
                <div className='player__icon--mobile player__icon--mobileLoading'>
                  <Spinner />
                </div>
              ) : !heart ? (
                <Tooltip title='Like' placement='top'>
                  <div
                    className='player__icon--mobile'
                    onClick={heartAction}
                  >
                    <FaRegHeart />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title='Unlike' placement='top'>
                  <div
                    className='player__icon--mobile '
                    onClick={heartAction}
                  >
                    <FaHeart className='player__heartIcon--active' />
                  </div>
                </Tooltip>
              )}
            </div>
          )}
        </div>
        <div
          className={`player__center ${
            isMobile ? 'player__center--mobile' : ''
          }`}
        >
          <div
            className={`player__wave  ${
              isMobile ? 'player__wave--mobile' : ''
            }`}
          >
            {loading && (
              <div className='player__waveLoadingAbsolute'>
                <div className='player__waveLoadingContainer'>
                  <Spinner />
                </div>
              </div>
            )}
            <div id='waveform'></div>
          </div>
          {!isMobile && (
            <div className='player__icons'>
              {!heart ? (
                <Tooltip title='Like' placement='top'>
                  <div className='player__icon' onClick={heartAction}>
                    <FaRegHeart />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title='Unlike' placement='top'>
                  <div className='player__icon' onClick={heartAction}>
                    <FaHeart className='player__heartIcon--active' />
                  </div>
                </Tooltip>
              )}
              <Tooltip title='Repeat' placement='top'>
                <div
                  className={`player__icon ${
                    repeat ? 'player__toggled' : 'player__untoggled'
                  }`}
                  onClick={repeatSong}
                >
                  <FiRepeat />
                </div>
              </Tooltip>
              <Tooltip title='Play Previous Song' placement='top'>
                <div
                  className='player__icon'
                  onClick={playPreviousSong}
                >
                  <FaStepBackward />
                </div>
              </Tooltip>
              {!paused ? (
                <Tooltip title='Pause' placement='top'>
                  <div
                    className='player__icon player__toggled'
                    onClick={playAudio}
                  >
                    <FaPause className='player__playIcon' />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title='Play' placement='top'>
                  <div
                    className='player__icon player__toggled'
                    onClick={playAudio}
                  >
                    <FaPlay className='player__playIcon' />
                  </div>
                </Tooltip>
              )}
              <Tooltip title='Play Next Song' placement='top'>
                <div className='player__icon' onClick={playNextSong}>
                  <FaStepForward />
                </div>
              </Tooltip>
              <Tooltip title='Shuffle' placement='top'>
                <div
                  className={`player__icon ${
                    shuffle ? 'player__toggled' : 'player__untoggled'
                  }`}
                  onClick={shuffleSongs}
                >
                  <FiShuffle />
                </div>
              </Tooltip>
              <Tooltip title='Add to playlist' placement='top'>
                <div
                  className='player__icon player__listIcon'
                  data-drawer-trigger
                  aria-controls='drawer-name'
                  aria-expanded='false'
                  onClick={() => showAddToPlaylistModal()}
                >
                  <MdPlaylistAdd />
                </div>
              </Tooltip>
            </div>
          )}
        </div>

        <div className='player__right'>
          {!isMobile && (
            <Grid container spacing={1}>
              <Grid item>
                <Tooltip title='Mute' placement='top'>
                  <div
                    className={`player__muteIcon ${
                      mute ? 'player__toggled' : ''
                    }`}
                    onClick={muteAudio}
                  >
                    <FaVolumeMute />
                  </div>
                </Tooltip>
              </Grid>

              <Grid item>
                <div className='player__audioIcon player__spacing'>
                  <FaVolumeUp />
                </div>
              </Grid>
              <Grid item xs>
                <div className='player__slider'>
                  <Slider
                    value={sliderValue}
                    onChange={handleVolumeChange}
                  />
                </div>
              </Grid>
            </Grid>
          )}
        </div>
      </div>

      <Modal
        open={addToPlaylistModal}
        onClose={() => showAddToPlaylistModal()}
        aria-labelledby='Add to playlist'
        aria-describedby='Add a track to playlist'
        className='player__modal'
      >
        <div className='player__modalContainer'>
          <h3>Select a playlist to add</h3>
          <FormControl
            variant='outlined'
            className='player__modalSelect'
          >
            <InputLabel id='select-playlist'>Playlist</InputLabel>
            <Select
              labelId='select-playlist'
              value={selectedPlaylist}
              onChange={e => handleSelectedPlaylist(e.target.value)}
              label='Playlist'
            >
              <MenuItem value='none'>None</MenuItem>
              {playlists && playlists.length > 0 ? (
                playlists
                  .filter(
                    p =>
                      !p.type ||
                      (p.type && p.type !== 'recently_played')
                  )
                  .map(playlist => (
                    <MenuItem value={playlist.uid} key={playlist.uid}>
                      {playlist.name}
                    </MenuItem>
                  ))
              ) : (
                <React.Fragment />
              )}
            </Select>
          </FormControl>
          <div className='player__modalButtons'>
            <Button
              className='player__modalButtons--cancel'
              onClick={() => showAddToPlaylistModal()}
            >
              <p>Cancel</p>
            </Button>
            <Button
              className='player__modalButtons--add'
              onClick={() => addToPlaylist({ type: 'none' })}
              action='addingTrackToPlaylist'
            >
              <p>Add</p>
            </Button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default Player
