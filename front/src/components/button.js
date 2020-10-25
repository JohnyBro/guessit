import styled from 'styled-components'
import colors from '../variables/colors'

const Btn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-transform: uppercase;

    padding: 10px;
    border: 3px ${colors.secondary[1]} solid;
    border-radius: 5px;

    &:hover {
        background-color: ${colors.secondary[2]};
    }
`
Btn.displayName = "Btn.div"

function Button(props){
    return (
        <Btn className={props.className}>
            {props.children}
        </Btn>
    )
}

export default Button