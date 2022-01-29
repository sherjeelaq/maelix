import React, { useState, useEffect, useMemo } from 'react'
import './Genres.css'
import GenreOne from 'assets/genre-1.jpeg'
import GenreTwo from 'assets/genre-2.jpeg'
import GenreThree from 'assets/genre-3.jpeg'
import GenreFour from 'assets/genre-4.jpeg'
import { ImageApi } from 'lib'

function Genres({ title }) {
  const [image, setImage] = useState(null)

  const Background = useMemo(() => {
    let temp = [GenreOne, GenreTwo, GenreThree, GenreFour]
    let rand = Math.floor(Math.random() * temp.length)
    return temp[rand]
  }, [])

  useEffect(() => {
    async function getImage() {
      const temp = await ImageApi.getImageFromText(title)
      setImage(
        temp && temp.length > 0 ? temp[0].largeImageURL : Background
      )
    }
    getImage()
  }, [title, Background])

  return (
    <div
      className='genres__discover'
      style={{
        backgroundImage: `url(${image})`,
        backgroundColor: '#b2b2b2'
      }}
    >
      <div className='genres__bg'>
        <h3
          style={{
            backgroundImage: `url(${image})`,
            backgroundColor: '#b2b2b2',
            backgroundPosition: 'center',
            fontSize: 30
          }}
        >
          {title}
        </h3>
      </div>
    </div>
  )
}

export default Genres
