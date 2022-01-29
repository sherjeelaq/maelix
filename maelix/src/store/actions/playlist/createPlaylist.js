import Api from '../../../lib/Api'

function createPlaylist(payload) {
  return async (dispatch, getState) => {
    const res = await Api.post(
      '/playlist/createPlaylist',
      payload.data
    )
    if (!res || (res && !res.success)) return

    dispatch({
      type: 'UPDATE_PLAYLIST_TO_USER',
      payload: res.playlist
    })

    payload.action && payload.action()
  }
}

export default createPlaylist
