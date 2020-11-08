import React, { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import styled from 'styled-components'
import colors from '../variables/colors'
import Button from '../components/Button'

import socketContext from '../variables/socketContext'

function Room() {
    let socket = useContext(socketContext)
    let { roomID } = useParams()
    let [connected, setConnected] = useState(false)
    let [roomInfos, setRoomInfos] = useState(null)

    useEffect(() => {
        socket.on('roomJoined', (room) => {
            setRoomInfos(room)
            setConnected(true)
        })
        socket.emit('joinRoom', roomID)
    }, [])

    if (!connected) {
        return (
            <>
                {"Joining room"}
            </>
        )
    } else {
        return (
            <>
                Room name : {}
            </>
        )
    }
}

export default Room