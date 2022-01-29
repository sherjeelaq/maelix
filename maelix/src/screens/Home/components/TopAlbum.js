import React, { useState, useEffect, useMemo } from 'react'
import './TopAlbum.css'
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs'
import { MusicApi } from 'lib'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Image } from 'components'

function TopAlbum({ title, artist, artistId, cover, mbid }) {
  const dispatch = useDispatch()
  const { active } = useSelector(state => state.player)
  const [isPlaying, setIsPlaying] = useState(false)

  const isActive = useMemo(() => {
    return (
      active &&
      active.type === 'album' &&
      active.state &&
      (active.state.mbid === mbid ||
        (active.state.name?.toLowerCase() === title?.toLowerCase() &&
          active.state.artist_mbid === artistId))
    )
  }, [active, title, artistId])

  useEffect(() => {
    setIsPlaying(isActive)
  }, [isActive])

  const playAlbum = async details => {
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
      let albumDetails = await MusicApi.getAlbumDetails(details)

      if (!albumDetails && details.mbid) {
        delete details['mbid']
        albumDetails = await MusicApi.getAlbumDetails(details)
      }

      let tempArtistMBID = null
      if (
        albumDetails &&
        albumDetails.tracks &&
        albumDetails.tracks.length > 0 &&
        albumDetails.tracks[0].artist &&
        albumDetails.tracks[0].artist.mbid
      ) {
        tempArtistMBID = albumDetails.tracks[0].artist.mbid
        dispatch({
          type: 'SET_ACTIVE_PLAYER_STATE',
          payload: {
            type: 'album',
            state: {
              mbid: details.mbid ? details.mbid : null,
              name: albumDetails.name,
              artist_mbid: tempArtistMBID
            }
          }
        })
        dispatch({
          type: 'SET_PLAYER_STATE',
          payload: 'play'
        })
        dispatch({
          type: 'SET_PLAYER_LIST',
          payload: albumDetails.tracks
        })
      } else {
        toast.error('No songs found for this album!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
        // setIsPlaying(false)
      }
    }
  }

  const pauseAlbum = () => {
    setIsPlaying(false)
    dispatch({
      type: 'SET_PLAYER_STATE',
      payload: 'pause'
    })
  }

  const [isHover, setIsHover] = useState(false)

  return (
    <div className='topAlbum'>
      <Image
        src={cover}
        alt={title}
        className={`topAlbum__imgBackground ${
          isHover ? 'topAlbum__bgHover' : ''
        }`}
      />
      <div
        className='topAlbum__img'
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Image src={cover} alt={title} />
        {isPlaying ? (
          <div onClick={() => pauseAlbum()}>
            <BsFillPauseFill />
          </div>
        ) : (
          <div
            onClick={() =>
              playAlbum(
                mbid
                  ? { mbid, artist, album: title }
                  : { artist, album: title }
              )
            }
          >
            <BsFillPlayFill />
          </div>
        )}
      </div>
      <div className='topAlbum__details'>
        <h2>{title}</h2>
        <p>{artist}</p>
      </div>
    </div>
  )
}

export default TopAlbum
