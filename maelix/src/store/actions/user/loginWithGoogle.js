import Api from '../../../lib/Api'

function blockUser(payload) {
  return async (dispatch, getState) => {
    const res = await Api.post('/user/loginWithGoogle', payload.data)
    dispatch({
      type: 'SET_USER',
      payload: res.user
    })
    payload && payload.action && payload.action()
  }
}

export default blockUser
