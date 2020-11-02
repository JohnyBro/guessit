import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import colors from '../variables/colors'
import Button from '../components/Button'
import io from 'socket.io-client'
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
    let history = useHistory();
    const [socket, setSocket] = useState()
    const roomNameInput = useRef()

    useEffect(() => {
        const s = io('http://localhost:3001')

        s.on('roomCode', roomCode => {
            history.push(`/rooms/${roomCode}`)
        })

        setSocket(s)

        return () => s.disconnect()
    }, [])

    function createClick() {
        socket.emit('createRoom', roomNameInput.current.value)
    }

    return (
        <>
            <Title>
                Create Room
            </Title>
            <FormContainer>
                <div>Room's name</div>
                <Input ref={roomNameInput} />
                <Button onClick={createClick}>Create Room</Button>
            </FormContainer>
        </>
    )
}

export default CreateRoom