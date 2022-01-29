import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import Register from "../Auth/Register"
import Login from "../Auth/Login"

function NonUser() {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/" component={Login} />
        <Redirect from="*" to="/" />
      </Switch>
    </React.Fragment>
  )
}

export default NonUser
