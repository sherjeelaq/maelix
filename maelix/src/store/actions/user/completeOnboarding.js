import Api from '../../../lib/Api'

function completeOnboarding(payload) {
  return async (dispatch, getState) => {
    const res = await Api.post(
      '/user/completeOnboarding',
      payload.data
    )
    if (!res || (res && !res.success)) return

    dispatch({
      type: 'UPDATE_USER',
      payload: {
        ...payload.data,
        playlists: res.playlists
      }
    })
    payload.action && payload.action()
  }
}

export default completeOnboarding
