import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams } from "react-router-dom";
import styled from 'styled-components'

import SiteTitle from './Title'
import colors from '../variables/colors'
import Button from '../components/Button'
import socketContext from '../variables/socketContext'
import ImageToGuess from './imageToGuess'

//#region styled components

const FormContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
`

const Input = styled.input`
    width: 100%;
    font-size: 1.5rem;
    border-style: solid;
    padding: 10px;
    text-align: center;
    border-width: 3px;
    border-radius: 3px;
    background-color: #626977;
    border-color: #4e3b3a;
    color: white;

    &::placeholder{
        color: white;
        font-size: 1.5rem;
        opacity: 0.4;
    }

	&:focus {
        outline:none;
    }
`

const RoomGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 20%;
    grid-template-rows: min-content 1fr min-content min-content;
    gap: 20px;
    grid-template-areas:
        "title roominfos"
        "image players"
        "image buttons"
        "image input";
    padding: 20px;
    height: 100%;
    width: 100%;
`

const BoxElement = styled.div`
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
`

const ImageDisplay = styled(BoxElement)`
    grid-area: image;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Title = styled(BoxElement)`
    grid-area: title;
    display: flex;
    justify-content: center;
    align-items: center;
`

const RoomInfos = styled(BoxElement)`
    grid-area: roominfos;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 3rem;
`

const Players = styled(BoxElement)`
    grid-area: players;
    padding: 20px;
    font-size: 2rem;
`

const Buttons = styled(BoxElement)`
    grid-area: buttons;
`

const RoomInput = styled(BoxElement)`
    grid-area: input;
`

//#endregion

function Room() {
    let socket = useContext(socketContext)
    let { roomID } = useParams()
    let pseudoInput = useRef()
    let guessInput = useRef()
    let [connected, setConnected] = useState(false)
    let [roomInfos, setRoomInfos] = useState(null)
    let [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        let onRoomJoin = (room) => {
            setRoomInfos(room)
            setConnected(true)
        }
        let onNoRoom = (errorMsg) => {
            setErrorMessage(errorMsg)
        }
        let onRoomUpdate = (room) => {
            setRoomInfos(room)
        }

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

    let onStartGame = () => {
        socket.emit('startGame', roomID)
    }

    let onGuessInputKeyPress = (e) => {
        //If it's not the enter key or the value is empty
        if(e.keyCode != 13 || e.target.value == "") return

        socket.emit("guess", roomID, e.target.value.toLowerCase(), result => {
            if(result == true){
                
            }
        })

        guessInput.current.value = ""
    }

    let getPlayersList = () => {
        return roomInfos.players.map((player, index) => {
            return (
                <div key={index} style={{color: player.guessed ? "green" : "white"}}>
                    {player.pseudo}
                </div>
            )
        })
    }

    let renderConnection = () => {
        return (
            <>
                <SiteTitle />
                { errorMessage }
                <FormContainer >
                    <div>Pseudo</div>
                    <Input ref={pseudoInput} />
                    <Button onClick={joinRoom}>Join Room</Button>
                </FormContainer>
            </>
        )
    }

    let renderRoom = () => {
        return (
            <RoomGrid>
                <Title>
                    <SiteTitle />
                </Title>

                <RoomInfos>
                    <p>{roomInfos.name}</p>
                </RoomInfos>

                <ImageDisplay>
                    <ImageToGuess />
                </ImageDisplay>

                <Players>
                    {getPlayersList()}
                </Players>

                <Buttons>
                    {!roomInfos.started && roomInfos.host == socket.id && <Button onClick={onStartGame}>Start</Button>}
                </Buttons>

                <RoomInput>
                    <Input ref={guessInput} placeholder="Guess here!" onKeyDown={onGuessInputKeyPress}/>
                </RoomInput>
            </RoomGrid>
        )
    }

    if (!connected) {
        return renderConnection()
    } else {
        return renderRoom()
    }
}

export default Room