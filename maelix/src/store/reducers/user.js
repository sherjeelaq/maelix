const defaultState = null

const user = (userState = defaultState, action) => {
  const { payload, type } = action

  switch (type) {
    case 'SET_USER':
      return payload

    case 'LOGOUT':
      return defaultState

    case 'UPDATE_USER':
      return {
        ...userState,
        ...payload
      }
    case 'UPDATE_PLAYLIST_TO_USER':
      let tempPlaylists = userState.playlists
      let getIndex = tempPlaylists.findIndex(
        tp => tp.uid === payload.uid
      )

      let filteredPlaylists = [...tempPlaylists]

      if (!payload.isDeletePlaylist) {
        if (getIndex >= 0) {
          filteredPlaylists[getIndex] = payload
        } else {
          filteredPlaylists.push(payload)
        }
      } else {
        filteredPlaylists = filteredPlaylists.filter(
          p => p.uid !== payload.uid
        )
      }

      return {
        ...userState,
        playlists: filteredPlaylists
      }

    case 'UPDATE_USER_FAVOURITES':
      return {
        ...userState,
        favourites: payload
      }

    default:
      return userState
  }
}

export default user
