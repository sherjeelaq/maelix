import React, { useState, useEffect, useMemo } from 'react'
import { BsFillPersonFill, BsMusicNoteBeamed } from 'react-icons/bs'
import { FaUserAlt } from 'react-icons/fa'
import GenreOne from 'assets/genre-1.jpeg'
import GenreTwo from 'assets/genre-2.jpeg'
import GenreThree from 'assets/genre-3.jpeg'
import GenreFour from 'assets/genre-4.jpeg'
import './PageItem.css'
import { RiPlayCircleFill } from 'react-icons/ri'
import { goOutside } from 'helpers'
import ImageApi from 'lib/imageApi'
import millify from 'millify'

function PageItem({
  name,
  url,
  reach,
  photo,
  listeners,
  artistName,
  from
}) {
  const [image, setImage] = useState(null)

  const Background = useMemo(() => {
    let temp = [GenreOne, GenreTwo, GenreThree, GenreFour]
    let rand = Math.floor(Math.random() * temp.length)
    return temp[rand]
  }, [])

  useEffect(() => {
    async function getImage() {
      const temp = await ImageApi.getImageFromText(name)
      setImage(
        temp && temp.length > 0 ? temp[0].largeImageURL : Background
      )
    }
    if (from && from === 'genres') {
      getImage()
    } else if (from && (from === 'artists' || from === 'albums')) {
      setImage(photo)
    }
  }, [name, Background, from])

  return (
    <div
      className='pageItem'
      style={{
        backgroundImage: `url(${image})`,
        backgroundColor: '#b2b2b2'
      }}
    >
      <div
        className='pageItem__container'
        onClick={() => goOutside(url)}
      >
        <div
          className='pageItem__info'
          style={{
            width: from === 'albums' ? '100%' : '75%'
          }}
        >
          <h5>{name}</h5>
          <div className='pageItem__addInfo'>
            {from && from === 'genres' ? (
              <React.Fragment>
                <BsFillPersonFill />
                <p>{millify(parseInt(reach ? reach : 0))} reached</p>
              </React.Fragment>
            ) : from && from === 'artists' ? (
              <React.Fragment>
                <BsMusicNoteBeamed />
                <p>
                  {millify(parseInt(listeners ? listeners : 0))}{' '}
                  listeners
                </p>
              </React.Fragment>
            ) : from && from === 'albums' ? (
              <React.Fragment>
                <FaUserAlt
                  style={{
                    fontSize: 12
                  }}
                />
                <p>{artistName}</p>
              </React.Fragment>
            ) : (
              <React.Fragment />
            )}
          </div>
        </div>
        {from !== 'albums' && (
          <div className='pageItem__play'>
            <RiPlayCircleFill />
          </div>
        )}
      </div>
    </div>
  )
}

export default PageItem
