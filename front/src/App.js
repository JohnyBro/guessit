import styled from 'styled-components'
import colors from './variables/colors'

import Btn from './components/button'

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
Container.displayName = "Container.div"

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
        <Container>
            <Title>
                Guess It!
            </Title>
            <Btn>Create room</Btn>
            <Btn>Join room</Btn>
            <Btn>Submit images</Btn>
        </Container>
    );
}

export default App;
