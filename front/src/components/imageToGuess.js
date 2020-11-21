import react, { useEffect, useState, useContext, useRef } from 'react'
import socketContext from '../variables/socketContext'
import PixelizeWorker from '../workers/pixelize.worker'

function ImageToGuess(props){
    let socket = useContext(socketContext)
    let [baseImage, setBaseImage] = useState(null)
    let [pixelImage, setPixelImage] = useState(null)
    let pixelizeWorker = useRef(null)

    let onImage = data => setBaseImage(data)

    let onPixelize = async pixelSize => {
        pixelizeWorker.current.postMessage([baseImage, pixelSize])
        // let jimg = await jimp.read(baseImage)
        // pixelSize != 1 && jimg.pixelate(pixelSize)
        // let pixelImage = await jimg.getBase64Async(jimp.AUTO)
        // setPixelImage(pixelImage)
    }

    useEffect(() => {
        socket.on('image', onImage)

        pixelizeWorker.current = new PixelizeWorker({type: "module"});
        pixelizeWorker.current.onmessage = e => setPixelImage(e.data)

        return () => {
            socket.off('image', onImage)
            socket.removeAllListeners('pixelize')
        }
    }, [])

    useEffect(() => {
        if(baseImage){
            socket.removeAllListeners('pixelize')
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