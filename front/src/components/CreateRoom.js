import React from 'react'
import styled from 'styled-components'
import colors from '../variables/colors'

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
    return (
        <>
            <Title>
                Create Room
            </Title>
            <FormContainer>
                <div>Room's name</div>
                <Input />
            </FormContainer>
        </>
    )
}

export default CreateRoom