const defaultState = {
  loadingButton: null,
  screenDimensions: {
    width: null,
    height: null
  }
}

const appState = (state = defaultState, action) => {
  const { payload, type } = action

  switch (type) {
    // keeping this in case we'll need a global err res handler
    case 'HANDLE_RES':
      return {
        ...state,
        errRes: {
          err: payload.err ? payload.err : null,
          res: payload.res ? payload.res : null,
          isErr: payload.isErr
        }
      }

    case 'LOADING_BUTTON':
      return {
        ...state,
        loadingButton: payload
      }

    case 'SET_SCREEN_DIMENSION':
      return {
        ...state,
        screenDimensions: payload
      }

    default:
      return state
  }
}

export default appState
