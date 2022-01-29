import React from "react"
import Loading from "assets/loading.png"
import "./Spinner.css"

const Spinner = ({ dimensions = 21, loader }) => (
  <div
    className="spinner"
    style={{
      filter: loader && loader === "white" ? "invert(1)" : "invert(0)"
    }}
  >
    <img
      style={{ width: dimensions, height: dimensions }}
      src={Loading}
      alt="loading"
    />
  </div>
)

export default Spinner
