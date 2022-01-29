import React, { useEffect } from 'react'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router } from 'react-router-dom'
import User from './screens/Routes/User'
import NonUser from './screens/Routes/NonUser'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import Onboarding from 'screens/Auth/Onboarding'

function App() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: 'LOADING_BUTTON',
      payload: null
    })
  }, [])

  useEffect(() => {
    let timeout
    dispatch({
      type: 'SET_SCREEN_DIMENSION',
      payload: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
    const handleResize = () => {
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        dispatch({
          type: 'SET_SCREEN_DIMENSION',
          payload: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        })
      }, 400)
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <React.Fragment>
      <Router>
        {user ? (
          user.onboarded ? (
            <User />
          ) : (
            <Onboarding />
          )
        ) : (
          <NonUser />
        )}
      </Router>
      <ToastContainer />
    </React.Fragment>
  )
}

export default App
