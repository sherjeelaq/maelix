import React, { useEffect, useState } from 'react'
import { Tooltip } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import './Explore.css'
import axios from 'axios'
import TopAlbum from './TopAlbum'
import TopSong from './TopSong'
import Genres from './Genres'
import { MusicApi } from 'lib'
import { getRandomPlaceholder, getTime, goOutside } from 'helpers'
import { Meta } from 'components'
import PlaceholderImage from 'assets/placeholders/placeholder-image.webp'
import { Image } from 'components'

function Explore({ isMobile }) {
  const [country, setCountry] = useState('spain')
  const [localTopTracks, setLocalTopTracks] = useState([])
  const [localTopArtists, setLocalTopArtists] = useState([])
  const [globalTopAlbums, setGlobalTopAlbums] = useState([])
  const [globalTopTags, setGlobalTopTags] = useState([])

  const defaultImage = process.env.REACT_APP_DEFAULT_LASTFM_IMAGE

  useEffect(() => {
    async function fetchCountry() {
      const request = await axios.get(
        `https://api.freegeoip.app/json/?apikey=${process.env.REACT_APP_COUNTRY_API}`
      )
      setCountry(
        request && request.data && request.data.country_name
          ? request.data.country_name
          : 'spain'
      )
    }

    fetchCountry()
  }, [])

  useEffect(() => {
    async function getData() {
      let tracks = await MusicApi.getLocalTopTracks({ country })
      let artists = await MusicApi.getLocalTopArtists({
        country,
        limit: 6
      })
      let tags = await MusicApi.getGlobalTopTags()

      setLocalTopTracks(tracks.slice(0, 8))
      setLocalTopArtists(artists.slice(0, 6))
      setGlobalTopTags(tags.slice(0, 8))
    }

    if (country && country.length > 0) {
      getData()
    }
  }, [country])

  useEffect(() => {
    async function getAlbums() {
      let tempTags = [...globalTopTags].splice(
        Math.floor(Math.random() * (globalTopTags.length - 4)),
        3
      )
      let albums = await MusicApi.getTopAlbumsUsingTags({
        tags: tempTags || []
      })
      setGlobalTopAlbums(albums)
    }

    if (globalTopTags && globalTopTags.length > 0) {
      getAlbums()
    }
  }, [globalTopTags])

  return (
    <React.Fragment>
      <Meta title='Explore - Maelix' />
      <div className='explore__center'>
        <h3>Top Albums</h3>
        <div className='explore__topItems'>
          {globalTopAlbums && globalTopAlbums.length > 0
            ? globalTopAlbums.map(album => (
                <TopAlbum
                  title={album?.name}
                  artist={album?.artist?.name}
                  artistId={album?.artist?.mbid}
                  cover={
                    album.image && album.image.length > 0
                      ? album.image[album.image.length - 1]['#text']
                      : getRandomPlaceholder()
                  }
                  mbid={album?.mbid}
                  key={album.mbid ? album.mbid : album.name}
                />
              ))
            : Array(6)
                .fill('_')
                .map((_, i) => (
                  <div className='explore__topItems-skeleton' key={i}>
                    <Skeleton
                      animation='wave'
                      variant='rect'
                      width={isMobile ? 150 : 200}
                      height={isMobile ? 150 : 200}
                      className='explore__topItems-skeletonImg'
                    />
                    <Skeleton
                      animation='wave'
                      variant='text'
                      height={25}
                      className='explore__topItems-skeletonTitle'
                    />
                    <Skeleton
                      animation='wave'
                      variant='text'
                      height={15}
                      width={140}
                      className='explore__topItems-skeletonParagraph'
                    />
                  </div>
                ))}
        </div>
      </div>
      <div className='explore__bottom'>
        <div
          className={`explore__topSongs ${
            window.innerWidth <= 1714
              ? 'explore__topSongs--removeMargin'
              : ''
          }`}
        >
          <h3>Most Popular</h3>
          <p>Top 8</p>
          <div className='explore__topSongSingle'>
            {localTopTracks && localTopTracks.length > 0
              ? localTopTracks.map((track, index) => (
                  <TopSong
                    key={track?.name}
                    songDetails={track}
                    song={track?.name}
                    artist={track?.artist?.name}
                    artist_mbid={track?.artist?.mbid}
                    cover={
                      track.image && track.image.length > 0
                        ? track.image[track.image.length - 1][
                            '#text'
                          ] &&
                          !track.image[track.image.length - 1][
                            '#text'
                          ].includes(
                            '2a96cbd8b46e442fc41c2b86b821562f'
                          )
                          ? track.image[track.image.length - 1][
                              '#text'
                            ]
                          : PlaceholderImage
                        : getRandomPlaceholder()
                    }
                    length={
                      track.duration && track.duration !== '0'
                        ? getTime(track.duration)
                        : `-:-`
                    }
                    duration={track.duration}
                    rank={`0${index + 1}`}
                    key={track?.name}
                    removeData={true}
                  />
                ))
              : Array(8)
                  .fill('_')
                  .map((_, i) => <TopSong loading={true} key={i} />)}
          </div>
        </div>
        <div className='explore__bottomRight'>
          <h3>Top Artists</h3>
          <div className='explore__topArtists'>
            {localTopArtists && localTopArtists.length > 0
              ? localTopArtists.map(artist => (
                  <Tooltip
                    placement='top'
                    title={artist?.name}
                    key={artist?.mbid}
                  >
                    <div
                      className='explore__topArtistSingle'
                      onClick={() => goOutside(artist.url)}
                    >
                      <Image
                        src={
                          artist.image && artist.image.length > 0
                            ? artist.image[artist.image.length - 1][
                                '#text'
                              ] &&
                              !artist.image[artist.image.length - 1][
                                '#text'
                              ].includes(defaultImage)
                              ? artist.image[artist.image.length - 1][
                                  '#text'
                                ]
                              : artist.coverImage &&
                                artist.coverImage.length > 0
                              ? artist.coverImage
                              : artist.image[artist.image.length - 1][
                                  '#text'
                                ]
                            : getRandomPlaceholder()
                        }
                        alt={artist?.name}
                      />
                      <h5>{artist?.name}</h5>
                    </div>
                  </Tooltip>
                ))
              : Array(6)
                  .fill('_')
                  .map((_, i) => (
                    <div className='explore__topArtistSingle' key={i}>
                      <Skeleton
                        variant='rect'
                        animation='wave'
                        width={124}
                        height={124}
                        style={{
                          borderRadius: 62
                        }}
                      />
                      <Skeleton
                        variant='text'
                        width='100%'
                        style={{
                          marginTop: 15
                        }}
                      />
                    </div>
                  ))}
          </div>

          <h3>Discover</h3>
          <div
            className={`explore__genres ${
              globalTopTags && globalTopTags.length > 0
                ? ''
                : 'explore__genres--loading'
            }`}
          >
            {globalTopTags && globalTopTags.length > 0
              ? globalTopTags.map(tag => (
                  <Genres title={tag?.name} key={tag?.name} />
                ))
              : Array(4)
                  .fill('_')
                  .map((_, i) => (
                    <Skeleton
                      variant='rect'
                      animation='wave'
                      width={124}
                      height={124}
                      style={{
                        borderRadius: 10
                      }}
                      key={i}
                    />
                  ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Explore
