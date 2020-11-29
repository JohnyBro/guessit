import { useEffect, useState, useContext } from 'react'
import socketContext from '../variables/socketContext'
import styled from 'styled-components'

const Image = styled.img`
    max-width:100%;
    max-height:100%;
`

function ImageToGuess(props){
    let socket = useContext(socketContext)
    let [image, setImage] = useState(null)

    let onImage = data => setImage(data)

    useEffect(() => {
        socket.on('image', onImage)

        return () => {
            socket.off('image', onImage)
        }
    }, [])

    return (
        <Image src={image} />
    )
}

ImageToGuess.displayName = "ImageToGuess"

export default ImageToGuess