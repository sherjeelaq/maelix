import React, { useMemo, useState } from 'react'
import './User.css'
import Home from '../Home'
import Playlist from '../Playlist'
import Page from '../Page'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { env } from 'lib'
import Sidebar from '../Home/components/Sidebar'
import Player from './components/Player/Player'
import Header from './components/Header'

function User() {
  const { screenDimensions } = useSelector(state => state.appState)
  const [openSidebar, setOpenSidebar] = useState(false)
  const toggleSidebar = val => {
    setOpenSidebar(val)
  }

  const isMobile = useMemo(() => {
    return (
      screenDimensions && screenDimensions.width <= env.SCREEN_WIDTH
    )
  }, [screenDimensions])

  return (
    <React.Fragment>
      <div className='app'>
        <div className='app__main'>
          <Sidebar
            openSidebar={openSidebar}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
          <div className='app__explore'>
            <Header
              isMobile={isMobile}
              toggleSidebar={toggleSidebar}
            />
            <Switch>
              <Route
                exact
                path='/'
                render={props => (
                  <Home toggleSidebar={toggleSidebar} {...props} />
                )}
              />
              <Route path='/playlist/:uid' component={Playlist} />
              <Route path='/:type' component={Page} />
              <Redirect from='*' to='/' />
            </Switch>
          </div>
        </div>
        <div className='app__player'>
          <Player />
        </div>
      </div>
    </React.Fragment>
  )
}

export default User
