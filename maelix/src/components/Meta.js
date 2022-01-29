import React from 'react'
import { Helmet } from 'react-helmet'
import Favicon from 'assets/favicon.ico'
function Meta({ title }) {
  return (
    <Helmet>
      <title>{title}</title>
      <link rel='icon' href={Favicon} />
    </Helmet>
  )
}

export default Meta
