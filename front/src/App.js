import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import styled from 'styled-components'

import Home from './components/Home'
import CreateRoom from './components/CreateRoom'
import RoomBrowser from './components/RoomBrowser'
import Submit from './components/Submit'

import colors from './variables/colors'

const AppContainer = styled.div`
    width: 100%;
    height: 100%;
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
    return (
        <Router>
            <AppContainer>
                <Title>
                    Guess It!
                </Title>
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route path="/create">
                        <CreateRoom />
                    </Route>

                    <Route path="/rooms">
                        <RoomBrowser />
                    </Route>

                    <Route path="/submit">
                        <Submit />
                    </Route>
                </Switch>
            </AppContainer>
        </Router>
    )
}

export default App;
