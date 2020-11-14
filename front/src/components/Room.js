import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams } from "react-router-dom";
import styled from 'styled-components'
import colors from '../variables/colors'
import Button from '../components/Button'

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
    let [connected, setConnected] = useState(false)
    let [roomInfos, setRoomInfos] = useState(null)
    let pseudoInput = useRef()
    let [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        let onRoomJoin = (room) => {
            setRoomInfos(room)
            setConnected(true)
        }
        let onNoRoom = (errorMsg) => {
            setErrorMessage(errorMsg)
        }
        let onRoomUpdate = (room) => setRoomInfos(room)
        socket.on('roomJoined', onRoomJoin)
        socket.on('noRoom', onNoRoom)
        socket.on('roomUpdate', onRoomUpdate)

        return () => {
            socket.off('roomJoined', onRoomJoin)
            socket.off('noRoom', onNoRoom)
            socket.off('roomUpdate', onRoomUpdate)

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
        console.log(roomInfos.players);
        return (
            <>
                <p>Room name : {roomInfos.name}</p>
                <p>Players: {Object.keys(roomInfos.players).map((key, index) => <span key={index}>{roomInfos.players[key].pseudo}<br /></span>)}</p>
            </>
        )
    }
}

export default Room