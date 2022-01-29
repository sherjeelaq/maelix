const images = [
  require('../assets/placeholders/1.jpg').default,
  require('../assets/placeholders/2.jpg').default,
  require('../assets/placeholders/3.jpg').default,
  require('../assets/placeholders/4.jpg').default
]

const getRandomPlaceholder = () => {
  return images[Math.floor(Math.random() * images.length) || 0]
}

export default getRandomPlaceholder
