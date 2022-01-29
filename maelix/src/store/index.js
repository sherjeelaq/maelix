import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import ReduxThunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import storage from 'redux-persist/lib/storage'

// import reducers
import { user, appState, player } from './reducers'

const rootPersistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet,
  timeout: null
}

const rootReducer = combineReducers({
  user,
  appState,
  player
})

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension's options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const pReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = createStore(
  pReducer,
  composeEnhancers(applyMiddleware(ReduxThunk))
)

export const persistor = persistStore(store)
