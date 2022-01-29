import Api from '../../../lib/Api'

function addTrackToPlaylist(payload) {
  return async (dispatch, getState) => {
    const res = await Api.post(
      '/playlist/addTrackToPlaylist',
      payload.data
    )
    if (!res || (res && !res.success)) {
      payload.action && payload.failAction()
      return
    }

    dispatch({
      type: 'UPDATE_PLAYLIST_TO_USER',
      payload: res.playlist
    })
    if (res.isFavourite) {
      dispatch({
        type: 'UPDATE_USER_FAVOURITES',
        payload: res.favourites
      })
    }
    payload.action && payload.action()
  }
}

export default addTrackToPlaylist
