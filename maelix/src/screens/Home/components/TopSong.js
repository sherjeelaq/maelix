import React, { useEffect, useMemo, useState } from 'react'
import './TopSong.css'
import { Tooltip } from '@material-ui/core'
import {
  BsCaretRightFill,
  BsFillPlayFill,
  BsFillPauseFill
} from 'react-icons/bs'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { goOutside } from 'helpers'
import { Skeleton } from '@material-ui/lab'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist
} from 'actions/playlist'
import { Spinner, Image } from 'components'

function TopSong({
  songDetails,
  song,
  artist,
  artist_mbid,
  cover,
  length,
  duration,
  rank,
  url,
  noExtra,
  removeData,
  loading
}) {
  const { _id: userId, favourites } = useSelector(state => state.user)
  const { list: playList, active: playerActive } = useSelector(
    state => state.player
  )
  const dispatch = useDispatch()
  const [heart, setHeart] = useState(false)
  const [heartLoading, setHeartLoading] = useState(false)
  const [favouriteObj, setFavouriteObj] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const isActive = useMemo(() => {
    return (
      playerActive &&
      playerActive.type === 'track' &&
      playerActive.state &&
      playerActive.state.artist_mbid &&
      playerActive.state.artist_mbid === artist_mbid &&
      playerActive.state.name?.toLowerCase() === song.toLowerCase()
    )
  }, [playList, playerActive, artist_mbid, song])

  useEffect(() => {
    setIsPlaying(isActive)
  }, [isActive])

  useEffect(() => {
    if (favourites && favourites.length > 0) {
      const favourited = favourites.find(
        fav => fav.name === song && fav.artist_mbid === artist_mbid
      )
      setHeart(favourited ? true : false)
      setFavouriteObj(favourited)
    } else {
      setHeart(false)
    }
  }, [favourites])

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
          action: () => {
            setHeartLoading(false)

            toast.success(`${song} removed successfully!`, {
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

      setHeart(false)
    } else {
      setHeartLoading(true)
      const addData = {
        addToFavourite: true,
        userId: userId,
        track: {
          name: song,
          artist: {
            name: artist,
            mbid: artist_mbid
          },
          coverImage: cover,
          duration: parseInt(duration ? duration : 0)
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

  const playSong = () => {
    setIsPlaying(true)
    if (isActive) {
      dispatch({
        type: 'SET_PLAYER_STATE',
        payload: 'play'
      })
    } else {
      dispatch({
        type: 'SET_PLAYER_STATE',
        payload: 'pause'
      })
      dispatch({
        type: 'SET_ACTIVE_PLAYER_STATE',
        payload: {
          type: 'track',
          state: {
            artist_mbid:
              songDetails &&
              songDetails.artist &&
              songDetails.artist.mbid
                ? songDetails.artist.mbid
                : null,
            name:
              songDetails && songDetails.name ? songDetails.name : ''
          }
        }
      })
      dispatch({
        type: 'SET_PLAYER_STATE',
        payload: 'play'
      })
      dispatch({
        type: 'SET_PLAYER_LIST',
        payload: [songDetails]
      })
    }
  }

  const pauseSong = () => {
    setIsPlaying(false)
    dispatch({
      type: 'SET_PLAYER_STATE',
      payload: 'pause'
    })
  }

  return (
    <div
      className={noExtra ? 'searchSong' : 'topSong'}
      onClick={() => (noExtra ? goOutside(url) : {})}
    >
      <div className='topSong__left'>
        {loading ? (
          <React.Fragment>
            <Skeleton
              animation='wave'
              variant='rect'
              height={noExtra ? 32 : 50}
              width={noExtra ? 32 : 50}
              style={{
                borderRadius: 5
              }}
            />
            <Skeleton
              animation='wave'
              variant='text'
              height={noExtra ? 18 : 25}
              width={noExtra ? 100 : '20vw'}
              style={{
                marginLeft: 10
              }}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {!noExtra && <h4>{rank}</h4>}
            <Image
              src={cover}
              alt={song}
              className={noExtra ? 'searchSong__songImg' : ''}
            />
            <BsCaretRightFill />

            {noExtra || removeData ? (
              <div>
                <h3
                  className={noExtra ? 'searchSong__songTitle' : ''}
                >
                  {song}
                </h3>
                <p className='searchSong__artist'>{artist}</p>
              </div>
            ) : (
              <h3 className={noExtra ? 'searchSong__songTitle' : ''}>
                {song}
              </h3>
            )}
          </React.Fragment>
        )}
      </div>
      {!noExtra && loading && !removeData ? (
        <Skeleton
          variant='text'
          height={25}
          width={100}
          style={{
            marginRight: 10
          }}
        />
      ) : (
        !noExtra && (
          <React.Fragment>
            {!removeData && (
              <div className='topSong__center'>
                <p className='topSong__artist'>{artist}</p>
                <p>{length}</p>
              </div>
            )}

            <div className='topSong__right'>
              {heartLoading ? (
                <div
                  style={{
                    marginRight: 15
                  }}
                >
                  <Spinner />
                </div>
              ) : !heart ? (
                <Tooltip title='Like' placement='top'>
                  <div
                    className='topSong__icon'
                    onClick={heartAction}
                  >
                    <FaRegHeart />
                  </div>
                </Tooltip>
              ) : (
                heart && (
                  <Tooltip title='Unlike' placement='top'>
                    <div
                      className='topSong__icon'
                      onClick={heartAction}
                    >
                      <FaHeart className='topSong__heartIcon--active' />
                    </div>
                  </Tooltip>
                )
              )}
              {isPlaying ? (
                <Tooltip title='Pause Song' placement='top'>
                  <div
                    className='topSong__iconTwo'
                    onClick={() => pauseSong()}
                  >
                    <BsFillPauseFill />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title='Play Song' placement='top'>
                  <div
                    className='topSong__iconTwo'
                    onClick={() => playSong()}
                  >
                    <BsFillPlayFill />
                  </div>
                </Tooltip>
              )}
            </div>
          </React.Fragment>
        )
      )}
    </div>
  )
}

export default TopSong
