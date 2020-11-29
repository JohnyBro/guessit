import { Link } from "react-router-dom"
import styled from 'styled-components'

const Title = styled(Link)`
    font-weight: 500;
    font-size: 4rem;
`

function SiteTitle(props){
    return (
        <Title to="/">Guess It!</Title>
    )
}

SiteTitle.displayName = "Title"

export default SiteTitle