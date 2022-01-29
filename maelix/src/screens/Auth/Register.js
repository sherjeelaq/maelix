import React, { useState } from 'react'
import './Register.css'
import { Link } from 'react-router-dom'
import { BsArrowRightShort } from 'react-icons/bs'
import axios from 'axios'
import RegisterSvg from 'assets/svgs/RegisterSvg'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { env } from 'lib'
import { Button } from 'components'
import { useDispatch } from 'react-redux'
import Logo from 'assets/logos/maelix-full.png'

function Register() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = () => {
    dispatch({
      type: 'LOADING_BUTTON',
      payload: 'registering'
    })
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
      dispatch({
        type: 'LOADING_BUTTON',
        payload: null
      })
      return false
    }
    axios({
      method: 'POST',
      data: {
        username: username,
        password: password,
        email: email
      },
      withCredentials: true,
      url: `${env.API_URL}/user/register`
    }).then(() => {
      setUsername('')
      setPassword('')
      setEmail('')
      dispatch({
        type: 'LOADING_BUTTON',
        payload: null
      })
      toast.success('Sucessfully registered', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      history.push('/')
    })
  }

  return (
    <div className='register'>
      <div className='register__left'>
        <img src={Logo} alt='logo' />

        <h1>Register</h1>

        <div className='register__form'>
          <form>
            <input
              type='text'
              placeholder='Your Username'
              className='register__input'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type='email'
              placeholder='Your Email'
              className='register__input'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Your Password'
              className='register__input'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <Button
              className='register__submitButton'
              onClick={register}
              action='registering'
              loader='white'
            >
              <h4>Register</h4>
              <BsArrowRightShort />
            </Button>

            <hr />
            <div className='register__login'>
              <h6>
                Already have an account? <Link to='/'>Login</Link>
              </h6>
            </div>
          </form>
        </div>
      </div>
      <div className='register__right'>
        <div className='register__musicContainer'>
          <div className='register__music'>
            <div className='register__note register__note1'>
              &#119135;
            </div>
            <div className='register__note register__note2'>
              &#119138;
            </div>
            <div className='register__note register__note3'>
              &#9839;
            </div>
            <div className='register__note register__note4'>
              &#9837;
            </div>
            <div className='register__note register__note5'>
              &#119140;
            </div>
          </div>
        </div>
        <RegisterSvg />
      </div>
    </div>
  )
}

export default Register
