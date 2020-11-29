import react, { useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import socketContext from '../variables/socketContext'

import SiteTitle from './Title'
import Button from './Button'

const Title = styled.div`
    text-align: center;
`

const SelectedImages = styled.div`
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
    justify-content: center;
    align-items: end;
    gap: 20px;
    padding: 20px;
`

const Image = styled.img`
    display: block;
    max-width: 100%;
    max-height: 100%;
`

const Cell = styled.div`
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
`

function Submit() {
    let socket = useContext(socketContext)
    let [images, setImages] = useState(null)
    let [statusMessage, setStatusMessage] = useState(null)
    let inputs = useRef([])

    const onFile = async e => {
        console.log(inputs)
        console.log(e.target.files)
        let promises = []

        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];

            promises.push(new Promise((resolve, reject) => {
                let fileReader = new FileReader()
                fileReader.onerror = () => {
                    fileReader.abort()
                    console.log("Erreur lors de la lecture des images")
                }
                fileReader.onload = () => {
                    resolve({base64: URL.createObjectURL(file), buffer: fileReader.result, name: null})
                }
                fileReader.readAsArrayBuffer(file)
            }))
        }

        let results = await Promise.all(promises)
        setImages(results)
    }

    const onSubmit = () => {
        if(inputs.current.filter(name => typeof(name) == 'string').length < images.length){
            setStatusMessage("Plz fill the name for every images")
            return
        }

        let dataToUpload = images.map((imageData, index) => {
            let data = {buffer: imageData.buffer, name: inputs.current[index].toLowerCase()}
            return data
        })

        socket.emit("submitImage", dataToUpload, message => {
            if(message == "OK"){
                setStatusMessage("Upload done")
                setImages(null)
            }else{
                setStatusMessage("Upload failed")
            }
        })
    }

    const renderSelectedImages = () => {
        return images.map((image, index) => {
            return (
                <Cell>
                    <Image src={image.base64} />
                    Name
                    <input type="text" onChange={(e) => inputs.current[index] = e.target.value}/>
                </Cell>
            )
        })
    }

    return (
        <>
            <SiteTitle/>
            {!images && <Title>The community can submit images</Title>}
            <input type="file" name="myImage" onChange={onFile} multiple accept="image/png, image/jpeg" autocomplete="off" />
            <SelectedImages>
                {images && renderSelectedImages()}
            </SelectedImages>
            {statusMessage}
            {images && <Button onClick={onSubmit} >Submit images</Button>}
        </>
    )
}

Submit.displayName = "Submit"

export default Submit