import React, { useMemo, useState } from 'react'
import Explore from './components/Explore'
import { env } from 'lib'
import { useSelector } from 'react-redux'

function Home({ toggleSidebar }) {
  const { screenDimensions } = useSelector(state => state.appState)

  const isMobile = useMemo(() => {
    return (
      screenDimensions && screenDimensions.width <= env.SCREEN_WIDTH
    )
  }, [screenDimensions])

  return <Explore toggleSidebar={toggleSidebar} isMobile={isMobile} />
}

export default Home
