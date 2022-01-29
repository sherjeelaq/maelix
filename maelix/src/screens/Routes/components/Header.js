import React, { useState, useEffect } from 'react'
import SearchSong from '../../Home/components/SearchSong'
import './Header.css'
import { GiHamburgerMenu } from 'react-icons/gi'
import { MdExitToApp } from 'react-icons/md'
import { ListItemIcon, Menu, MenuItem } from '@material-ui/core'
import { Avatar } from '@material-ui/core'
import { MusicApi, Api } from 'lib'
import { useDispatch, useSelector } from 'react-redux'

let debouncedValue
function Header({ isMobile, toggleSidebar }) {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loadingSearchResults, setLoadingSearchResults] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)

  const openSidebar = () => {
    toggleSidebar(true)
  }

  useEffect(() => {
    clearTimeout(debouncedValue)
    setLoadingSearchResults(true)
    async function searchItems() {
      debouncedValue = setTimeout(async () => {
        const res = await MusicApi.getSearchResults(search)
        setSearchResults(res)
        setLoadingSearchResults(false)
      }, 500)
    }

    if (search && search.length > 0) {
      searchItems()
    }
  }, [search])

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    let loggedOut = await Api.get('/user/logout')
    dispatch({
      type: 'LOGOUT',
      payload: null
    })
    dispatch({
      type: 'RESET_PLAYER',
      payload: null
    })
  }

  return (
    <React.Fragment>
      <div
        className={`header__top ${
          isMobile ? 'header__top--mobile' : ''
        }`}
      >
        {isMobile && (
          <div
            className='header__hamburger'
            onClick={() => openSidebar()}
          >
            <GiHamburgerMenu />
          </div>
        )}

        <SearchSong
          search={search}
          setSearch={setSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          loadingSearchResults={loadingSearchResults}
        />

        <div className='header__buttons'>
          <Avatar
            aria-controls='simple-menu'
            aria-haspopup='true'
            onClick={handleClick}
            className='header__avatar'
            src={user && user.avatar ? user.avatar : null}
          />
        </div>
      </div>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
        style={{
          marginTop: 48
        }}
      >
        <MenuItem onClick={() => handleLogout()}>
          <ListItemIcon>
            <MdExitToApp />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default Header
