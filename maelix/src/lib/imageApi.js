import axios from 'axios'
import rateLimit from 'axios-rate-limit'

const baseUrl = `https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API}&image_type=photo&safesearch=true&per_page=3`

const http = rateLimit(axios.create(), {
  maxRequests: 100,
  perMilliseconds: 60000,
  maxRPS: 1000
})

const ImageApi = {
  async getImageFromText(text) {
    const res = await http.get(`${baseUrl}&category=music&q=${text}`)

    if (res.data && res.data.hits && res.data.hits.length > 0) {
      return res.data.hits
    } else {
      const resWithoutCategory = await http.get(
        `${baseUrl}&q=${text}`
      )
      if (
        resWithoutCategory.data &&
        resWithoutCategory.data.hits &&
        resWithoutCategory.data.hits.length > 0
      ) {
        return resWithoutCategory.data.hits
      } else {
        return []
      }
    }
  }
}

export default ImageApi
