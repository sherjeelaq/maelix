import React, { useState } from 'react'
import './SidebarOption.css'
import { BsFillTrashFill } from 'react-icons/bs'
import { useHistory } from 'react-router-dom'
import { Modal, Tooltip } from '@material-ui/core'
import { Button } from 'components'
import { useDispatch } from 'react-redux'
import { deletePlaylist } from 'store/actions/playlist'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'

function SidebarOption({
  uid,
  title,
  Icon,
  active,
  canDelete,
  isPlaylist,
  toggleSidebar
}) {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen(!open)
  }

  const deleteCustomPlaylist = () => {
    dispatch({
      type: 'LOADING_BUTTON',
      payload: 'deletingPlaylist'
    })
    dispatch(
      deletePlaylist({
        data: { playlistUid: uid },
        action: () => {
          toggleOpen()
          if (location.pathname === `/playlist/${uid}`) {
            history.push('/')
          }
          dispatch({
            type: 'LOADING_BUTTON',
            payload: null
          })
          toast.success(`${title} deleted successfully!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })
        }
      })
    )
  }

  return (
    <React.Fragment>
      {!isPlaylist ? (
        <div
          className={`sidebarOption${
            active ? ' sidebarOption--active' : ''
          }`}
        >
          <Icon />
          <h5>{title}</h5>
        </div>
      ) : (
        <div
          className={`sidebarOption__customPlaylist ${
            active ? ' sidebarOption--active' : ''
          }`}
        >
          <div
            className='sidebarOption'
            onClick={() => {
              if (isPlaylist) {
                toggleSidebar && toggleSidebar()
                document.body.scrollTop = 0 // For Safari
                document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
                history.push(`/playlist/${uid}`)
              }
            }}
          >
            <Icon />
            <h5>
              {canDelete && title.length > 10
                ? title.substring(0, 8) + '...'
                : title}
            </h5>
          </div>
          {canDelete && (
            <Tooltip placement='top' title='Delete playlist'>
              <div
                className='sidebarOption--delete'
                onClick={e => {
                  e.stopPropagation()
                  toggleOpen()
                }}
              >
                <BsFillTrashFill />
              </div>
            </Tooltip>
          )}
        </div>
      )}
      <Modal
        open={open}
        onClose={() => toggleOpen()}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            outline: 0,
            width: 400,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 25
          }}
        >
          <h3>Are you sure you want to delete {title}?</h3>
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              className='sidebarOption__modalButtons--cancel'
              onClick={() => toggleOpen()}
            >
              <p>Cancel</p>
            </Button>
            <Button
              className='sidebarOption__modalButtons--add'
              onClick={() => deleteCustomPlaylist()}
              action='deletingPlaylist'
            >
              <p>OK</p>
            </Button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default SidebarOption
