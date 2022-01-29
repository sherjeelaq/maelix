import React, { useRef, useEffect } from 'react'
import { MdSearch } from 'react-icons/md'
import './SearchSong.css'
import TopSong from './TopSong'
import { getRandomPlaceholder, goOutside } from 'helpers'
import { Skeleton } from '@material-ui/lab'
import { Image } from 'components'

function SearchSong({
  search,
  setSearch,
  searchResults,
  setSearchResults,
  loadingSearchResults
}) {
  const defaultImage = process.env.REACT_APP_DEFAULT_LASTFM_IMAGE
  const resultsRef = useRef()

  useEffect(() => {
    if (!search) {
      document.removeEventListener('mousedown', handleClickOutside)
      return
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [search])

  function handleClickOutside(e) {
    if (resultsRef?.current?.contains(e.target)) return

    //clicked outside
    setSearch('')
    setSearchResults({
      artists: [],
      tracks: []
    })
  }

  return (
    <div className='searchSong__container'>
      <form className='searchSong__search'>
        <MdSearch className='searchSong__searchIcon' />

        <input
          type='text'
          className='searchSong__input'
          placeholder='Search for a song or an artist.'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>
      {search && search.length > 0 && (
        <div className='searchSong__nav' ref={resultsRef}>
          <div>
            <h5>Artists</h5>
            {loadingSearchResults
              ? Array(3)
                  .fill('temp')
                  .map(() => (
                    <div className='searchSong__artistContainer'>
                      <Skeleton
                        variant='rect'
                        width={32}
                        height={32}
                        className='searchSong__artistContainer--imgLoader'
                        animation='wave'
                      />
                      <Skeleton
                        variant='text'
                        width={100}
                        className='searchSong__artistContainer--textLoader'
                        animation='wave'
                      />
                    </div>
                  ))
              : searchResults &&
                searchResults.artists &&
                searchResults.artists.map(artist => (
                  <div
                    className='searchSong__artistContainer'
                    onClick={() => goOutside(artist.url)}
                    key={artist.mbid ? artist.mbid : artist.name}
                  >
                    <Image
                      src={
                        artist &&
                        artist.image &&
                        artist.image.length > 0
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
                ))}
          </div>
          <div>
            <h5>Songs</h5>
            {loadingSearchResults
              ? Array(3)
                  .fill('temp')
                  .map(() => (
                    <TopSong loading={true} noExtra={true} />
                  ))
              : searchResults &&
                searchResults.tracks &&
                searchResults.tracks.map(track => (
                  <TopSong
                    song={track?.name}
                    key={track?.name}
                    artist={track?.artist}
                    url={track.url}
                    cover={
                      track.image && track.image.length > 0
                        ? track.image[track.image.length - 1][
                            '#text'
                          ] &&
                          !track.image[track.image.length - 1][
                            '#text'
                          ].includes(defaultImage)
                          ? track.image[track.image.length - 1][
                              '#text'
                            ]
                          : track.coverImage &&
                            track.coverImage.length > 0
                          ? track.coverImage
                          : track.image[track.image.length - 1][
                              '#text'
                            ]
                        : getRandomPlaceholder()
                    }
                    noExtra={true}
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchSong
