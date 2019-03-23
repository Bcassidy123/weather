import React from 'react'
import styled from 'styled-components'
import lightning from '../assets/lightning.svg'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Img = styled.img`
  width: 250px;
  height: 250px;
`
export function SomethingWentWrong(props: any) {
  return <Wrapper>
    <Img src={lightning} alt="Something went wrong" />
  </Wrapper>
}