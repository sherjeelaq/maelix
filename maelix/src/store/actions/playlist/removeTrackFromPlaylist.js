import Api from '../../../lib/Api'

function removeTrackFromPlaylist(payload) {
  return async (dispatch, getState) => {
    const res = await Api.post(
      '/playlist/removeTrackFromPlaylist',
      payload.data
    )
    if (!res || (res && !res.success)) return

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

export default removeTrackFromPlaylist
