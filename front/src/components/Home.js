import styled from 'styled-components'
import { Link } from "react-router-dom"
import SiteTitle from './Title'

import Btn from './Button'

const HomeButton = styled(Btn)`
    margin-top: 10px;
`

function Home() {
    return (
        <>
            <SiteTitle/>
            <Link to="/create"><HomeButton>Create room</HomeButton></Link>
            <Link to="/rooms"><HomeButton>Join room</HomeButton></Link>
            <Link to="/submit"><HomeButton>Submit images</HomeButton></Link>
        </>
    );
}

export default Home;
