import Fragment, { useEffect, useState } from 'react'
import Image from 'next/image'

const HEIGHT = 512
const WIDTH = 512

const GeneratedImage = ({ imageId }) => {
  const [imageUrl, setImageUrl] = useState(null)
  const [intervalId, setIntervalId] = useState(null)
  useEffect(() => {
    function getImageUrl () {
      fetch('/api/images/' + imageId, {
        headers: { Accept: 'application/json' }
      }).then(response => {
        response.json().then(data => {
          console.log('GeneratedImage', data)
          setImageUrl(data.output)
        })
      })
    }
    getImageUrl()
    const intervalId = setInterval(() => getImageUrl(), 1000)
    setIntervalId(intervalId)
    return () => {
      clearInterval(intervalId)
    }
  }, [])
  if (imageUrl && intervalId) {
    console.log('cancelling interval')
    clearInterval(intervalId)
    setIntervalId(null)
  }
  return imageUrl ? (
    <Image src={imageUrl} alt='generated image' width={WIDTH} height={HEIGHT} />
  ) : null
}

export default GeneratedImage
