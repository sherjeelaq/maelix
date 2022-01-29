import React from 'react'
import Spinner from './Spinner'
import { useSelector } from 'react-redux'

const MyButton = props => {
  const { loadingButton } = useSelector(({ appState }) => appState)
  const loading = loadingButton && loadingButton === props.action

  return (
    <div
      className='button'
      {...props}
      onClick={!loading ? props.onClick : () => {}}
    >
      {loading ? (
        <Spinner loader={props.loader} />
      ) : props.children ? (
        props.children
      ) : (
        ''
      )}
    </div>
  )
}

export default MyButton
