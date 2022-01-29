import Sound from 'assets/1.mp3'
import SoundTwo from 'assets/2.mp3'
import SoundThree from 'assets/3.mp3'
import SoundFour from 'assets/4.mp3'
import SoundFive from 'assets/5.mp3'
import SoundSix from 'assets/6.mp3'

const songs = [
  {
    link: Sound
  },
  {
    link: SoundTwo
  },
  {
    link: SoundThree
  },
  {
    link: SoundFour
  },
  {
    link: SoundFive
  },
  {
    link: SoundSix
  }
]
const getRoyaltyFreeSongs = list => {
  return list.map((track, i) => {
    return {
      ...track,
      ...songs[i % 6]
    }
  })
}

export default getRoyaltyFreeSongs
