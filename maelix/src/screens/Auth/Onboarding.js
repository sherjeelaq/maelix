import React, { useState, useEffect } from 'react'
import './Onboarding.css'
import { useHistory } from 'react-router-dom'
import OnboardingSvg from 'assets/svgs/OnboardingSvg'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { completeOnboarding } from 'actions/user'
import { Button } from 'components'
import { useSelector } from 'react-redux'

function Onboarding() {
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (user) {
      if (user.name) {
        setName(user.name)
      }
      if (user.username) {
        setUsername(user.username)
      }
    }
  }, [user])
  const completeOnboardingProcess = e => {
    // dispatch({
    //   type: "LOADING_BUTTON",
    //   payload: "onboarding"
    // })
    e.preventDefault()

    let error = false
    if (!username || (username && username.length <= 5)) {
      toast.error(
        username > 0 && username <= 5
          ? 'Username must be 6 characters long!'
          : 'Username cannot be empty!',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      )
      error = true
    }
    if (!name || (name && name.length <= 5)) {
      toast.error(
        name > 0 && name <= 5
          ? 'Name must be 6 characters long!'
          : 'Name cannot be empty!',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      )
      error = true
    }
    if (!error) {
      dispatch(
        completeOnboarding({
          data: {
            username: username,
            name: name,
            onboarded: true
          },
          action: () => {
            dispatch({
              type: 'LOADING_BUTTON',
              payload: null
            })
            history.push('/')
          }
        })
      )
    } else {
      dispatch({
        type: 'LOADING_BUTTON',
        payload: null
      })
    }
  }

  return (
    <div className='onboarding'>
      <div className='onboarding__left'>
        <h1>Almost there!</h1>
        <p>Please fill the details below to proceed.</p>

        <div className='onboarding__form'>
          <form>
            <input
              type='text'
              placeholder='Your Name'
              className='onboarding__input'
              value={name}
              onChange={e => setName(e.target.value)}
              required={true}
            />
            <input
              type='text'
              placeholder='Your Username'
              className='onboarding__input'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required={true}
            />
            <Button
              className='onboarding__submitButton'
              onClick={e => completeOnboardingProcess(e)}
              action='onboarding'
              loader='white'
            >
              <h4>Submit</h4>
            </Button>
          </form>
        </div>
      </div>
      <div className='onboarding__right'>
        <OnboardingSvg />
      </div>
    </div>
  )
}

export default Onboarding
