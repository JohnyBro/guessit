import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams } from "react-router-dom";
import styled from 'styled-components'
import colors from '../variables/colors'
import Button from '../components/button'

import socketContext from '../variables/socketContext'

const FormContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 10px;
`

const Input = styled.input`
    border-radius: 3px;
    border: 3px solid ${colors.secondary[0]};
    background: ${colors.primary[1]};
    color: white;
`

function Room() {
    let socket = useContext(socketContext)
    let { roomID } = useParams()
    let pseudoInput = useRef()
    let [connected, setConnected] = useState(false)
    let [roomInfos, setRoomInfos] = useState(null)
    let [errorMessage, setErrorMessage] = useState(null)
    let [imageData, setImageData] = useState(null)

    useEffect(() => {
        let onRoomJoin = (room) => {
            setRoomInfos(room)
            setConnected(true)
        }
        let onNoRoom = (errorMsg) => {
            setErrorMessage(errorMsg)
        }
        let onRoomUpdate = (room) => setRoomInfos(room)
        let onImg = (img) => {
            setImageData(img)
        }
        socket.on('roomJoined', onRoomJoin)
        socket.on('noRoom', onNoRoom)
        socket.on('roomUpdate', onRoomUpdate)
        socket.on('img', onImg)

        return () => {
            socket.off('roomJoined', onRoomJoin)
            socket.off('noRoom', onNoRoom)
            socket.off('roomUpdate', onRoomUpdate)
            socket.off('img', onImg)

            socket.emit('leaveRoom', roomID)
        }
    }, [])

    let joinRoom = () => {
        if (pseudoInput.current.value == "") {
            setErrorMessage("Plz fill the pseudo field")
            return
        }

        socket.emit('joinRoom', roomID, pseudoInput.current.value)
    }

    let startGame = () => {
        socket.emit('startGame', roomID)
    }

    if (!connected) {
        return (
            <>
                { errorMessage}
                <FormContainer >
                    <div>Pseudo</div>
                    <Input ref={pseudoInput} />

                    <Button onClick={joinRoom}>Join Room</Button>
                </FormContainer >
            </>
        )
    } else {
        return (
            <>
                {imageData && <img style={{maxWidth: '100%'}} src={imageData}/>}
                <p>Room name : {roomInfos.name}</p>
                <p>Players: {roomInfos.players.map((player, index) => <span key={index}>{player}<br /></span>)}</p>
                <Button onClick={startGame}>Start</Button>
            </>
        )
    }
}

export default Room