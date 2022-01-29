import axios from "axios"
import { store } from "../store/"
import env from "./env"

const API_URL = env.API_URL

// global api
const Api = {
  async get(endpoint, params) {
    try {
      const { user } = store && store.getState ? store.getState() : null
      const req = await axios.get(`${API_URL}${endpoint}`, {
        withCredentials: true,
        params: {
          _id: user && user._id ? user._id : null
        }
      })
      if (req.status === 202) {
        store.dispatch({ type: "HANDLE_RES", payload: { res: req.data } })
        return true
      }
      return req.data
    } catch (e) {
      store.dispatch({
        type: "HANDLE_RES",
        payload: {
          err: e && e.response ? e.response.data : "Something went wrong!"
        }
      })
      return false
    }
  },
  async post(endpoint, params) {
    try {
      const { user } = store && store.getState ? store.getState() : null
      const req = await axios.post(`${API_URL}${endpoint}`, params, {
        withCredentials: true,
        params: {
          _id: user && user._id ? user._id : null
        }
      })
      if (req.status === 202) {
        store.dispatch({ type: "HANDLE_RES", payload: { res: req.data } })
        return true
      }

      return req.data
    } catch (e) {
      store.dispatch({
        type: "HANDLE_RES",
        payload: {
          err: e && e.response ? e.response.data : "Something went wrong!"
        }
      })

      return false
    }
  },
  async put(endpoint, params) {
    try {
      const { user } = store && store.getState ? store.getState() : null
      const req = await axios.put(`${API_URL}${endpoint}`, params, {
        withCredentials: true,
        params: {
          _id: user && user._id ? user._id : null
        }
      })
      if (req.status === 202) {
        store.dispatch({ type: "HANDLE_RES", payload: { res: req.data } })
        return true
      }

      return req.data
    } catch (e) {
      store.dispatch({
        type: "HANDLE_RES",
        payload: {
          err: e && e.response ? e.response.data : "Something went wrong!"
        }
      })

      return { err: e?.response?.data }
    }
  },
  async patch(endpoint, params) {
    try {
      const { user } = store && store.getState ? store.getState() : null
      const req = await axios.patch(`${API_URL}${endpoint}`, params, {
        withCredentials: true,
        params: {
          _id: user && user._id ? user._id : null
        }
      })

      if (req.status === 202) {
        store.dispatch({ type: "HANDLE_RES", payload: { res: req.data } })
        return true
      }

      return req.data
    } catch (e) {
      store.dispatch({
        type: "HANDLE_RES",
        payload: {
          err: e && e.response ? e.response.data : "Something went wrong!"
        }
      })
      return false
    }
  },
  async delete(endpoint) {
    try {
      const { user } = store && store.getState ? store.getState() : null
      const req = await axios.delete(`${API_URL}${endpoint}`, {
        withCredentials: true,
        params: {
          _id: user && user._id ? user._id : null
        }
      })
      if (req.status === 202) {
        store.dispatch({ type: "HANDLE_RES", payload: { res: req.data } })
        return true
      }
    } catch (e) {
      store.dispatch({
        type: "HANDLE_RES",
        payload: {
          err: e && e.response ? e.response.data : "Something went wrong!"
        }
      })
      return false
    }
  }
}

export default Api
