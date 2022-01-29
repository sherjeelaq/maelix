const defaultState = {
  state: 'pause',
  list: [],
  active: {
    type: 'album', //album, playlist, random song
    state: null
  }
}

const player = (playerState = defaultState, action) => {
  const { payload, type } = action

  switch (type) {
    case 'SET_PLAYER_STATE':
      return {
        ...playerState,
        state: payload
      }

    case 'SET_PLAYER_LIST':
      return {
        ...playerState,
        list: payload
      }

    case 'SET_ACTIVE_PLAYER_STATE':
      return {
        ...playerState,
        active: payload
      }

    case 'RESET_PLAYER':
      return defaultState

    default:
      return playerState
  }
}

export default player
