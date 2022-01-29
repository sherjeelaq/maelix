import React, { useState } from 'react'
import './Login.css'
import { Link, useHistory } from 'react-router-dom'
import { BsArrowRightShort } from 'react-icons/bs'
import { AiOutlineGoogle } from 'react-icons/ai'
import LoginSvg from 'assets/svgs/LoginSvg'
import { toast } from 'react-toastify'
import { auth, provider } from '../../firebase'
import { useDispatch } from 'react-redux'
import { login, loginWithGoogle } from 'actions/user'
import { Button, Meta } from 'components'
import Logo from 'assets/logos/maelix-full.png'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  const loginWithUsername = e => {
    dispatch({
      type: 'LOADING_BUTTON',
      payload: 'login'
    })
    e.preventDefault()

    let error = false
    if (!username || (username && username.length <= 5)) {
      toast.error(
        username.length > 0 && username.length <= 5
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
    if (!password || (password && password.length <= 5)) {
      toast.error(
        password.length > 0 && password.length <= 5
          ? 'Password must be 6 characters long!'
          : 'Password cannot be empty!',
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
        login({
          data: {
            username: username,
            password: password
          },
          action: res => {
            if (res && res.error) {
              toast.error(res.error, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
              })
            }
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

  const signInwithGoogle = () => {
    dispatch({
      type: 'LOADING_BUTTON',
      payload: 'loginWithGoogle'
    })
    auth
      .signInWithPopup(provider)
      .then(result => {
        let ggData = {
          id: result.user.uid,
          name: result.user.displayName
            ? result.user.displayName
            : result.additionalUserInfo.profile.name,
          email: result.user.email
            ? result.user.email
            : result.additionalUserInfo.profile.email,
          username: '',
          photo: result.user.photoURL ? result.user.photoURL : 'none'
        }

        dispatch(
          loginWithGoogle({
            data: ggData,
            action: () => {
              dispatch({
                type: 'LOADING_BUTTON',
                payload: null
              })
            }
          })
        )
      })
      .catch(error => {
        dispatch({
          type: 'LOADING_BUTTON',
          payload: null
        })
        toast.error('There was an error logging in!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      })
  }
  return (
    <div className='login'>
      <Meta title='Login - Maelix' />

      <div className='login__left'>
        <img src={Logo} alt='logo' />
        <div className='login__musicContainer'>
          <div className='login__music'>
            <div className='login__note login__note1'>&#119070;</div>
            <div className='login__note login__note2'>&#9838;</div>
            <div className='login__note login__note3'>&#9839;</div>
            <div className='login__note login__note4'>&#9837;</div>
            <div className='login__note login__note5'>&#119083;</div>
          </div>
        </div>

        <h1>Welcome Back</h1>
        <div className='login__external'>
          <Button
            className='login__google'
            onClick={e => signInwithGoogle(e)}
            action='loginWithGoogle'
          >
            <AiOutlineGoogle color='#03a9f4' size='20px' />
            <h4>Log in with Google</h4>
          </Button>
        </div>

        <div className='login__dividerWithText'>
          <hr />
          <h4>or login using email</h4>
        </div>

        <div className='login__form'>
          <form>
            <input
              type='text'
              placeholder='Your Username'
              className='login__input'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required={true}
            />
            <input
              type='password'
              placeholder='Your Password'
              className='login__input'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required={true}
            />
            <div className='login__formExtra'>
              <div className='login__keepMeLoggedIn'>
                <input type='checkbox' className='login__checkbox' />
                <p>Keep me logged in</p>
              </div>
            </div>

            <Button
              className='login__submitButton'
              onClick={e => loginWithUsername(e)}
              action='login'
              loader='white'
            >
              <h4>Log in</h4>
              <BsArrowRightShort />
            </Button>
            <div className='login__signup'>
              <h6>
                Don't have an account?{' '}
                <Link to='/register'>Register</Link>
              </h6>
            </div>
          </form>
        </div>
      </div>
      <div
        className='login__right'
        style={{
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute'
          }}
        >
          <LoginSvg />
        </div>
      </div>
    </div>
  )
}

export default Login
