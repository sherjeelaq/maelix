import React, { useEffect, useRef, useState } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { BsTrashFill } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Button, Image } from 'components'
import { removeTrackFromPlaylist } from 'actions/playlist'
import { Skeleton } from '@material-ui/lab'

function PlaylistItem({
  playlistUid,
  id,
  song,
  artist,
  cover,
  length,
  rank,
  dateAdded,
  isMobile,
  userId,
  loading
}) {
  const [open, setOpen] = useState(false)
  const itemRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!open) {
      document.removeEventListener('mousedown', handleClickOutside)
      return
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  function handleClickOutside(e) {
    if (itemRef?.current?.contains(e.target)) return

    //clicked outside
    toggleMenu()
  }

  const toggleMenu = () => {
    setOpen(!open)
  }

  const removeTrack = () => {
    dispatch({
      type: 'LOADING_BUTTON',
      payload: 'removingTrackFromPlaylist'
    })
    if (!id || !playlistUid) {
      toast.error('No song selected!', {
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
      dispatch(
        removeTrackFromPlaylist({
          data: {
            playlistUid,
            userId,
            trackId: id
          },
          action: () => {
            toast.success(`${song} removed successfully!`, {
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
        })
      )
    }
  }

  useEffect(() => {
    dispatch({
      type: 'LOADING_BUTTON',
      payload: null
    })
  }, [])

  return (
    <div className='playlist__item'>
      <h6 className='playlist__item--rank'>{rank}</h6>
      <div className='playlist__item--center'>
        {loading ? (
          <Skeleton
            variant='rect'
            width={60}
            height={60}
            style={{
              borderRadius: 12,
              marginLeft: 8
            }}
          />
        ) : (
          <Image
            src={cover}
            alt={song}
            className='playlist__item--img'
          />
        )}
        <div className='playlist__item--details'>
          {loading ? (
            <React.Fragment>
              <Skeleton
                variant='rect'
                width={150}
                height={25}
                animation='wave'
              />
              <Skeleton
                variant='rect'
                width={100}
                height={15}
                style={{
                  marginTop: 5
                }}
                animation='wave'
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h3>{song}</h3>
              <h5 className='playlist__item--artist'>{artist}</h5>
            </React.Fragment>
          )}
        </div>
      </div>

      {!isMobile && !loading && (
        <React.Fragment>
          <p className='playlist__item--info'>{dateAdded}</p>
          <p className='playlist__item--info'>{length}</p>
        </React.Fragment>
      )}
      {!loading && (
        <div
          style={{
            position: 'relative'
          }}
        >
          <div
            className='playlist__item--moreContainer'
            onClick={() => toggleMenu()}
          >
            <FiMoreHorizontal />
          </div>
          {open && (
            <div className='playlist__item--menu' ref={itemRef}>
              <Button
                action='removingTrackFromPlaylist'
                className='playlist__item--menuItem'
                onClick={() => removeTrack()}
              >
                <BsTrashFill />
                <p>Remove from playlist</p>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlaylistItem
