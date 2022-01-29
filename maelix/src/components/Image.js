import React from 'react'
import Placeholder from 'assets/placeholders/placeholder-image.webp'

function Image(props) {
  return (
    <img
      {...props}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null // prevents looping
        currentTarget.src = Placeholder
      }}
    />
  )
}

export default Image
