import react, { useEffect, useState, useContext } from 'react'
import { useStateWithCallbackLazy } from 'use-state-with-callback'
import styled from 'styled-components'
import jimp from 'jimp'
import socketContext from '../variables/socketContext'


function ImageToGuess(props){
    let socket = useContext(socketContext)
    let [baseImage, setBaseImage] = useState(null)
    let [pixelImage, setPixelImage] = useState(null)

    let onImage = data => setBaseImage(data)

    let onPixelize = async pixelSize => {
        console.log(pixelSize)
        let jimg = await jimp.read(baseImage)
        jimg.pixelate(pixelSize)
        let pixelImage = await jimg.getBase64Async(jimp.AUTO)
        setPixelImage(pixelImage)
    }

    useEffect(() => {
        socket.on('image', onImage)

        return () => {
            socket.off('image', onImage)
            socket.off('pixelize', onPixelize)//
        }
    }, [])

    useEffect(() => {
        if(baseImage){
            socket.off('pixelize', onPixelize)
            socket.on('pixelize', onPixelize)
            socket.emit('imageReady', props.roomID)
        }
    }, [baseImage])

    return (
        <img style={{maxWidth: "100%"}} src={pixelImage} />
    )
}

ImageToGuess.displayName = "ImageToGuess"

export default ImageToGuess