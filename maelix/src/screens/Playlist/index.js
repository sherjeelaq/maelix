import React, { useState, useEffect, useMemo } from 'react'
import './Playlist.css'
import PlaylistOne from 'assets/playlist-1.jpg'
import PlaylistTwo from 'assets/playlist-2.jpg'
import { format } from 'date-fns'
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import { Api, env } from 'lib'
import { getRandomPlaceholder, getTime } from 'helpers'
import PlaylistItem from './PlaylistItem'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Meta } from 'components'
import { Skeleton } from '@material-ui/lab'

function Playlist() {
  let { uid } = useParams()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const { screenDimensions } = useSelector(state => state.appState)
  const { active } = useSelector(state => state.player)

  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [playlist, setPlaylist] = useState(null)

  const playlistBg = useMemo(() => {
    const temp = [PlaylistOne, PlaylistTwo]
    return temp[Math.floor(Math.random() * 2)]
  }, [uid])

  const isMobile = useMemo(() => {
    return (
      screenDimensions && screenDimensions.width <= env.SCREEN_WIDTH
    )
  }, [screenDimensions])

  const hasTracks = useMemo(() => {
    return playlist && playlist.tracks && playlist.tracks.length > 0
  }, [playlist])

  const isActive = useMemo(() => {
    return (
      active &&
      active.type === 'playlist' &&
      active.state &&
      active.state.uid === uid &&
      hasTracks
    )
  }, [active, uid, hasTracks])

  useEffect(() => {
    setIsPlaying(isActive)
  }, [isActive])

  useEffect(() => {
    async function getPlaylist() {
      const res = await Api.get(`/playlist/getPlaylist/${uid}`)
      setPlaylist(res && res.playlist ? res.playlist : null)
      setLoading(false)
    }
    if (uid && uid.length > 0) {
      setLoading(true)
      getPlaylist()
    }
  }, [uid, user])

  const playPlaylist = () => {
    if (isActive) {
      setIsPlaying(true)
      dispatch({
        type: 'SET_PLAYER_STATE',
        payload: 'play'
      })
    } else if (hasTracks && uid) {
      setIsPlaying(true)
      dispatch({
        type: 'SET_PLAYER_STATE',
        payload: 'pause'
      })
      dispatch({
        type: 'SET_ACTIVE_PLAYER_STATE',
        payload: {
          type: 'playlist',
          state: {
            uid,
            name:
              playlist && playlist.name ? playlist.name : 'Unknown'
          }
        }
      })
      dispatch({
        type: 'SET_PLAYER_STATE',
        payload: 'play'
      })
      dispatch({
        type: 'SET_PLAYER_LIST',
        payload: playlist.tracks
      })
    } else {
      toast.error(
        !uid ? "Couldn't find playlist!" : 'No songs in playlist',
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
  }

  const pausePlaylist = () => {
    setIsPlaying(false)

    dispatch({
      type: 'SET_PLAYER_STATE',
      payload: 'pause'
    })
  }

  return (
    <div className='playlist__container'>
      <Meta
        title={` ${
          playlist && playlist.name ? playlist.name : 'Playlist'
        } - Maelix`}
      />
      <div
        style={{
          backgroundImage: `url(${playlistBg})`
        }}
        className='playlist__header--container'
      >
        <div className='playlist__header--inner'>
          {isPlaying ? (
            <div
              className='playlist__header--play'
              onClick={() => pausePlaylist()}
            >
              <BsFillPauseFill />
            </div>
          ) : (
            <div
              onClick={() => playPlaylist()}
              className={`playlist__header--play ${
                !hasTracks ? 'playlist__header--play-disabled' : ''
              }`}
            >
              <BsFillPlayFill />
            </div>
          )}
          <div className='playlist__header--right'>
            {loading ? (
              <Skeleton
                variant='text'
                animation='wave'
                height={50}
                width={150}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.6)'
                }}
              />
            ) : (
              <h3 className='playlist__header--heading'>
                {playlist?.name}
              </h3>
            )}
            <div className='playlist__header--info'>
              {loading ? (
                <Skeleton
                  variant='text'
                  animation='wave'
                  height={25}
                  width={225}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.6)'
                  }}
                />
              ) : (
                <React.Fragment>
                  <p className='playlist__header--number'>
                    {hasTracks
                      ? `${playlist.tracks.length} ${
                          playlist.tracks.length === 1
                            ? 'song'
                            : 'songs'
                        }`
                      : 'No songs'}
                  </p>
                  <p className='playlist__header--date'>
                    {format(
                      playlist && playlist.createdAt
                        ? new Date(playlist.createdAt)
                        : new Date(),
                      'do MMMM, yyyy'
                    )}
                  </p>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`playlist__body ${
          hasTracks ? 'playlist__body--container' : ''
        }`}
      >
        {loading ? (
          <div className='playlist__body---loading'>
            <PlaylistItem loading={true} isMobile={isMobile} />
            <PlaylistItem loading={true} isMobile={isMobile} />
            <PlaylistItem loading={true} isMobile={isMobile} />
          </div>
        ) : hasTracks ? (
          <div className='playlist__body---loaded'>
            {playlist.tracks.map((track, i) => (
              <PlaylistItem
                userId={user?._id}
                playlistUid={uid}
                id={track?._id}
                song={track?.name}
                key={track?.name}
                artist={track?.artist?.name}
                cover={
                  track.coverImage && track.coverImage.length > 0
                    ? track.coverImage
                    : track.artist && track.artist.imageUrl
                    ? track.artist.imageUrl
                    : getRandomPlaceholder()
                }
                length={
                  track.duration && track.duration > 0
                    ? getTime(track.duration)
                    : `${Math.floor(Math.random() * 3) + 1}: ${
                        Math.floor(Math.random() * 59) + 0
                      }`
                }
                rank={i + 1}
                dateAdded={format(
                  new Date(track.addedAt),
                  'MMM d, yyyy'
                )}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <div className='playlist__body--no_songs'>
            <h3>Playlist empty</h3>
            <p>No songs found in playlist.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Playlist
