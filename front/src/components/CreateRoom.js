import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import colors from '../variables/colors'
import Button from '../components/Button'

import socketContext from '../variables/socketContext'

import { useHistory } from "react-router-dom";

const FormContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 10px;
`

const Title = styled.div`
    font-size: 2rem;
    margin-bottom: 20px;
`

const Input = styled.input`
    border-radius: 3px;
    border: 3px solid ${colors.secondary[0]};
    background: ${colors.primary[1]};
    color: white;
`

function CreateRoom() {
    let socket = useContext(socketContext)
    let history = useHistory();
    let roomNameInput = useRef()
    let pseudoInput = useRef()
    let [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        socket.on('roomCode', (roomCode) => {
            history.push(`/room/${roomCode}`)
        })
    }, [])

    function createClick() {
        if (!roomNameInput.current.value) {
            setErrorMessage("Please enter a room name")
            return
        }

        socket.emit('createRoom', roomNameInput.current.value)
    }

    return (
        <>
            <Title>
                Create Room
            </Title>
            {errorMessage}
            <FormContainer>
                <div>Room's name</div>
                <Input ref={roomNameInput} />

                <Button onClick={createClick}>Create Room</Button>
            </FormContainer>
        </>
    )
}

export default CreateRoom