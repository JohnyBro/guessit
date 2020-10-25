import styled from 'styled-components'
import {Link} from "react-router-dom";
  
import colors from '../variables/colors'

import Btn from './Button'

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: stretch;
    background-color: ${colors.primary[0]};
    color: white;
    overflow-y: auto;
`
Container.displayName = "Home container.div"

const Title = styled.div`
    width: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 4rem;
    margin-bottom: 30px;
`
Title.displayName = "Title.div"

const HomeButton = styled(Btn)`
    margin-top: 10px;
`


function Home() {
    return (
        <Container>
            <Title>
                Guess It!
            </Title>
            <Link to="/create"><HomeButton>Create room</HomeButton></Link>
            <HomeButton>Join room</HomeButton>
            <HomeButton>Submit images</HomeButton>
        </Container>
    );
}

export default Home;
