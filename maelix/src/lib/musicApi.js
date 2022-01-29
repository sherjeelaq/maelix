import axios from 'axios'
import rateLimit from 'axios-rate-limit'

const baseUrl = 'https://ws.audioscrobbler.com/2.0/'
const API_KEY = process.env.REACT_APP_LASTFM_API_KEY
const defaultImage = process.env.REACT_APP_DEFAULT_LASTFM_IMAGE

const http = rateLimit(axios.create(), {
  maxRequests: 5,
  perMilliseconds: 1000,
  maxRPS: 5
})

const coverHttp = rateLimit(axios.create(), {
  maxRequests: 20,
  perMilliseconds: 1000,
  maxRPS: 20
})

async function getCoverImage(mbid, highQuality) {
  try {
    const cover = await coverHttp(
      `https://webservice.fanart.tv/v3/music/${mbid}?api_key=${process.env.REACT_APP_FANART_API}`
    )
    if (cover && cover.data) {
      if (highQuality) {
        if (
          cover.data.artistbackground &&
          cover.data.artistbackground.length > 0
        ) {
          return cover.data.artistbackground[0]?.url
        } else if (
          cover.data.artistthumb &&
          cover.data.artistthumb.length > 0
        ) {
          return cover.data.artistthumb[0]?.url
        }
      } else {
        if (
          cover.data.artistthumb &&
          cover.data.artistthumb.length > 0
        ) {
          return cover.data.artistthumb[0]?.url
        } else if (
          cover.data.artistbackground &&
          cover.data.artistbackground.length > 0
        ) {
          return cover.data.artistbackground[0]?.url
        }
      }
    }
  } catch (e) {
    console.log('Error getting image!')
  }
  return ''
}

const MusicApi = {
  async getGlobalTopArtists() {
    const res = await http.get(
      `${baseUrl}?method=chart.gettopartists&api_key=${API_KEY}&format=json`
    )
    if (
      res.data &&
      res.data.artists &&
      res.data.artists.artist &&
      res.data.artists.artist.length > 0
    ) {
      let artists = res.data.artists.artist
      artists = await Promise.all(
        artists.map(async artist => {
          if (
            artist.image[artist.image.length - 1]['#text'].includes(
              defaultImage
            ) &&
            artist.mbid
          ) {
            return {
              ...artist,
              coverImage: await getCoverImage(artist.mbid)
            }
          }
        })
      )
      artists = artists.filter(a => a && a.name)
      return artists
    } else {
      return []
    }
  },
  async getGlobalTopTracks() {
    const res = await http.get(
      `${baseUrl}?method=chart.gettoptracks&api_key=${API_KEY}&format=json`
    )
    if (
      res.data &&
      res.data.tracks &&
      res.data.tracks.track &&
      res.data.tracks.track.length > 0
    ) {
      return res.data.tracks.track
    } else {
      return {
        track: []
      }
    }
  },
  async getGlobalTopTags() {
    const res = await http.get(
      `${baseUrl}?method=chart.gettoptags&api_key=${API_KEY}&format=json`
    )
    if (
      res.data &&
      res.data.tags &&
      res.data.tags.tag &&
      res.data.tags.tag.length > 0
    ) {
      return res.data.tags.tag
    } else {
      return {
        tag: []
      }
    }
  },
  async getLocalTopArtists({ country, limit }) {
    const res = await http.get(
      `${baseUrl}?method=geo.gettopartists&country=${
        country ? country : 'spain'
      }&api_key=${API_KEY}&format=json${limit && `&limit=${limit}`}`
    )

    if (
      res.data &&
      res.data.topartists &&
      res.data.topartists.artist &&
      res.data.topartists.artist.length > 0
    ) {
      let artists = res.data.topartists.artist
      artists = await Promise.all(
        artists.map(async artist => {
          if (
            artist.image[artist.image.length - 1]['#text'].includes(
              defaultImage
            ) &&
            artist.mbid
          ) {
            return {
              ...artist,
              coverImage: await getCoverImage(artist.mbid)
            }
          }
        })
      )
      return artists
    } else {
      return []
    }
  },
  async getLocalTopTracks({ country }) {
    const res = await http.get(
      `${baseUrl}?method=geo.gettoptracks&country=${
        country ? country : 'spain'
      }&api_key=${API_KEY}&format=json`
    )
    if (
      res.data &&
      res.data.tracks &&
      res.data.tracks.track &&
      res.data.tracks.track.length > 0
    ) {
      return res.data.tracks.track
    } else {
      return []
    }
  },
  async getTopAlbumsUsingTags({ tags, limit }) {
    let albums = []

    const getAlbumfromTag = async tag => {
      const res = await http.get(
        `${baseUrl}?method=tag.gettopalbums&tag=${tag}&api_key=${API_KEY}&format=json&limit=${
          limit ? limit + '' : '2'
        }`
      )
      return res
    }
    for (let i = 0; i < tags.length; i++) {
      let tempRes = await getAlbumfromTag(tags[i].name)
      albums = albums.concat(
        tempRes.data &&
          tempRes.data.albums &&
          tempRes.data.albums.album
          ? tempRes.data.albums.album
          : []
      )
    }
    return albums
  },
  async getSearchResults(search) {
    let results = {
      artists: [],
      tracks: []
    }

    const artistsRes = await http.get(
      `${baseUrl}?method=artist.search&artist=${search}&api_key=${API_KEY}&format=json&limit=3`
    )
    if (
      artistsRes.data &&
      artistsRes.data.results &&
      artistsRes.data.results.artistmatches &&
      artistsRes.data.results.artistmatches.artist &&
      artistsRes.data.results.artistmatches.artist.length > 0
    ) {
      results.artists = artistsRes.data.results.artistmatches.artist
      results.artists = await Promise.all(
        results.artists.map(async artist => {
          if (
            artist.image[artist.image.length - 1]['#text'].includes(
              defaultImage
            ) &&
            artist.mbid
          ) {
            return {
              ...artist,
              coverImage: await getCoverImage(artist.mbid)
            }
          } else {
            return {
              ...artist,
              coverImage:
                artist.image[artist.image.length - 1]['#text']
            }
          }
        })
      )
    } else {
      results.artists = []
    }

    const trackRes = await http.get(
      `${baseUrl}?method=track.search&track=${search}&api_key=${API_KEY}&format=json&limit=3`
    )
    if (
      trackRes.data &&
      trackRes.data.results &&
      trackRes.data.results.trackmatches &&
      trackRes.data.results.trackmatches.track &&
      trackRes.data.results.trackmatches.track.length > 0
    ) {
      results.tracks = trackRes.data.results.trackmatches.track
    } else {
      results.tracks = []
    }

    return results
  },
  async getAlbumDetails(details) {
    let tempUrl = `${baseUrl}?method=album.getinfo&api_key=${API_KEY}&format=json`

    if (details.mbid) {
      tempUrl = tempUrl + `&mbid=${details.mbid}`
    } else if (details.album && details.artist) {
      tempUrl =
        tempUrl + `&artist=${details.artist}&album=${details.album}`
      tempUrl = encodeURI(tempUrl)
    } else {
      return null
    }

    try {
      const res = await http.get(tempUrl)

      if (res.data && res.data.album) {
        let temp = {
          ...res.data.album,
          tracks: res.data.album.tracks.track.map(track => {
            return {
              ...track,
              coverImage:
                res.data.album.image[res.data.album.image.length - 1][
                  '#text'
                ]
            }
          })
        }

        return temp
      } else {
        return null
      }
    } catch (e) {
      return null
    }
  }
}

export default MusicApi
