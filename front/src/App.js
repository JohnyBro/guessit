import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import styled from 'styled-components'
import io from 'socket.io-client'

import SocketContext from './variables/socketContext'

import Home from './components/Home'
import CreateRoom from './components/CreateRoom'
import Room from './components/Room'
import RoomBrowser from './components/RoomBrowser'
import Submit from './components/Submit'

import colors from './variables/colors'
import config from './variables/config'

const AppContainer = styled.div`
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    background-color: ${colors.primary[0]};
    color: white;
    overflow-y: auto;
`

const Title = styled.div`
    width: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 4rem;
    margin-bottom: 30px;
`
Title.displayName = "Title.div"

function App() {
    const [socket, setSocket] = useState()
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        const s = io(`http://${config.socketHost}:${config.socketPort}`)
        s.on("connect", () => {
            setSocket(s)
            setConnected(true)
        })

        s.on("disconnect", () => setConnected(false))

        return () => {
            setConnected(false)
            s.disconnect()
        }
    }, [])

    return (
        <Router>
            <AppContainer>
                <Link to="/">
                    <Title>Guess It!</Title>
                </Link>
                {(() => {
                    if (!connected) {
                        return "Connecting ..."
                    } else {
                        return (
                            <SocketContext.Provider value={socket}>
                                <Switch>
                                    <Route path="/" exact>
                                        <Home />
                                    </Route>
                                    <Route path="/create" exact>
                                        <CreateRoom />
                                    </Route>

                                    <Route path="/rooms" exact>
                                        <RoomBrowser />
                                    </Route>

                                    <Route path="/submit" exact>
                                        <Submit />
                                    </Route>
                                    <Route path="/room/:roomID" exact>
                                        <Room />
                                    </Route>
                                </Switch>
                            </SocketContext.Provider>
                        )
                    }
                })()}
            </AppContainer>
        </Router>
    )
}

export default App;
