import React, { useEffect, useState } from 'react'
import { Skeleton } from '@material-ui/lab'
import { MusicApi } from 'lib'
import { useParams } from 'react-router-dom'
import { PageItem } from './components'
import './Page.css'
import { Meta } from 'components'

function Page() {
  let { type } = useParams()
  const [data, setData] = useState([])
  const [tagsForAlbum, setTagsForAlbum] = useState([])

  useEffect(() => {
    async function getData() {
      if (type === 'albums') {
        let tempTags = await MusicApi.getGlobalTopTags()
        setTagsForAlbum(tempTags)
      } else {
        let res
        if (type === 'genres') {
          res = await MusicApi.getGlobalTopTags()
        } else if (type === 'artists') {
          res = await MusicApi.getGlobalTopArtists()
        }
        setData(res)
      }
    }

    setData([])
    getData()
  }, [type])

  useEffect(() => {
    async function getAlbums() {
      let splicedTags = {
        tags:
          tagsForAlbum.splice(
            Math.floor(Math.random() * tagsForAlbum.length - 7),
            6
          ) || [],
        limit: 7
      }
      let res = await MusicApi.getTopAlbumsUsingTags(splicedTags)
      setData(res)
    }

    if (tagsForAlbum && tagsForAlbum.length > 0) {
      getAlbums()
    }
  }, [tagsForAlbum])

  return (
    <div className='page__container'>
      <Meta
        title={`Popular ${type.replace(/./, c =>
          c.toUpperCase()
        )} - Maelix`}
      />

      <h3>Popular {type}</h3>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap'
        }}
      >
        {data && data.length > 0
          ? data.map(t => (
              <PageItem
                key={t.name}
                name={t.name}
                url={t.url}
                reach={t.reach}
                listeners={t.listeners}
                artistName={t.artist?.name}
                photo={
                  t.coverImage
                    ? t.coverImage
                    : t.image &&
                      t.image.length > 0 &&
                      t.image[t.image.length - 1]['#text']
                }
                from={type}
              />
            ))
          : Array(12)
              .fill('temp')
              .map(() => (
                <Skeleton
                  variant='rect'
                  animation='wave'
                  width={200}
                  height={200}
                  style={{
                    borderRadius: 16,
                    marginTop: 15,
                    marginRight: 10
                  }}
                />
              ))}
      </div>
    </div>
  )
}

export default Page
