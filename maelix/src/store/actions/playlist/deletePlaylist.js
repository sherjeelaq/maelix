import Api from '../../../lib/Api'

function deletePlaylist(payload) {
  return async (dispatch, getState) => {
    const res = await Api.post(`/playlist/deletePlaylist/`, {
      uid: payload.data.playlistUid
    })
    if (!res || (res && !res.success)) return

    dispatch({
      type: 'UPDATE_PLAYLIST_TO_USER',
      payload: {
        isDeletePlaylist: true,
        uid: payload.data.playlistUid
      }
    })

    payload.action && payload.action()
  }
}

export default deletePlaylist
