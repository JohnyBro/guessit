import {Switch, Route} from "react-router-dom";

import Home from './components/Home'

function App() {
    return (
        <Switch>
            <Route path="/">
                <Home/>
            </Route>
            <Route path="/rooms">
            </Route>
            <Route path="/create">
            </Route>
            <Route path="/submit">
            </Route>
        </Switch>
    )
}

export default App;
