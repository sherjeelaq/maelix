import Api from "../../../lib/Api"

function login(payload) {
  return async (dispatch, getState) => {
    const res = await Api.post("/user/login", payload.data)
    if (res && res.user) {
      dispatch({
        type: "SET_USER",
        payload: res.user
      })
    }
    payload.action && payload.action(res)
  }
}

export default login
