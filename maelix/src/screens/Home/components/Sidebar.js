import React, { useEffect, useMemo, useState } from "react"
import "./Sidebar.css"
import SidebarOption from "./SidebarOption"
import { AiFillAppstore } from "react-icons/ai"
import {
  BsFillCollectionFill,
  BsFillHeartFill,
  BsFillMicFill,
  BsList
} from "react-icons/bs"
import { HiSpeakerphone } from "react-icons/hi"
import { MdTimer } from "react-icons/md"
import { FaPlus } from "react-icons/fa"
import { Tooltip } from "@material-ui/core"
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer
} from "@material-ui/core"
import { Link, useLocation } from "react-router-dom"
import Logo from "assets/logos/maelix-full.png"
import { useSelector, useDispatch } from "react-redux"
import { createPlaylist } from "store/actions/playlist"
import { toast } from "react-toastify"
import { env } from "lib"

function InnerComponent({ toggleSidebar }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState(false)
  const { playlists, _id: userId } = useSelector((state) => state.user)
  const { screenDimensions } = useSelector((state) => state.appState)

  const isMobile = useMemo(() => {
    return screenDimensions && screenDimensions.width <= env.SCREEN_WIDTH
  }, [screenDimensions])

  const menuItems = useMemo(() => {
    return [
      {
        link: "/",
        name: "Explore",
        Icon: AiFillAppstore
      },
      {
        link: "/genres",
        name: "Genres",
        Icon: HiSpeakerphone
      },
      {
        link: "/artists",
        name: "Artists",
        Icon: BsFillMicFill
      },
      {
        link: "/albums",
        name: "Albums",
        Icon: BsFillCollectionFill
      }
    ]
  }, [])

  useEffect(() => {
    if (!open) {
      setName("")
    }
  }, [open])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const changeName = (text) => {
    if (!text || (text && text.length <= 0)) {
      setError(true)
    } else if (text && text.length > 15) {
      return
    } else {
      setError(false)
      setName(text)
    }
  }

  const addNewPlaylist = () => {
    if (!name || (name && name.length <= 0)) {
      toast.error(`Playlist name cannot be empty`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    } else {
      dispatch(
        createPlaylist({
          data: { playlistName: name, userId },
          action: () => {
            toast.success(`${name} successfully created`, {
              position: "top-right",
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
      setOpen(false)
    }
  }

  return (
    <div className={`sidebar ${isMobile ? "sidebar--isMobile" : ""}`}>
      <Link
        to="/"
        onClick={() => {
          toggleSidebar && toggleSidebar()
          document.body.scrollTop = 0 // For Safari
          document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
        }}
      >
        <div className="sidebar__header">
          <img src={Logo} alt="logo" />
        </div>
      </Link>
      <div className="sidebar__items sidebar__top">
        <div className="sidebar__heading">
          <h5>RECOMMENDED</h5>
        </div>
        {menuItems &&
          menuItems.map((mi) => (
            <Link
              key={mi.link}
              to={mi.link}
              onClick={() => {
                toggleSidebar && toggleSidebar()
                document.body.scrollTop = 0 // For Safari
                document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
              }}
            >
              <SidebarOption
                title={mi.name}
                Icon={mi.Icon}
                active={location.pathname === mi.link}
              />
            </Link>
          ))}
      </div>
      <div
        className="sidebar__items sidebar__bottom"
        id="sidebar__scrollbarStyle"
      >
        <div className="sidebar__playlist">
          <h5>PLAYLISTS</h5>
          <Tooltip title="Create a new playlist" placement="top">
            <div className="sidebar__playlistAdd" onClick={handleClickOpen}>
              <FaPlus />
            </div>
          </Tooltip>
        </div>
        <div className="sidebar__playlist--list">
          {playlists &&
            playlists.length > 0 &&
            playlists.map((playlist) => (
              <SidebarOption
                key={playlist.uid}
                uid={playlist.uid}
                title={playlist.name}
                Icon={
                  playlist.type === "recently_played"
                    ? MdTimer
                    : playlist.type === "favourites"
                    ? BsFillHeartFill
                    : BsList
                }
                active={location.pathname === `/playlist/${playlist.uid}`}
                isPlaylist={true}
                canDelete={playlist.type && playlist.type === "custom"}
                toggleSidebar={toggleSidebar}
              />
            ))}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for your new playlist
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Playlist"
            type="text"
            required={true}
            fullWidth
            value={name}
            onChange={(e) => changeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => addNewPlaylist()}
            color="primary"
            disabled={error}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
function Sidebar({ isMobile, openSidebar, toggleSidebar }) {
  return (
    <React.Fragment>
      {isMobile ? (
        <Drawer
          anchor="left"
          open={openSidebar}
          onClose={() => toggleSidebar(false)}
        >
          <InnerComponent toggleSidebar={toggleSidebar} />
        </Drawer>
      ) : (
        <InnerComponent />
      )}
    </React.Fragment>
  )
}

export default Sidebar
