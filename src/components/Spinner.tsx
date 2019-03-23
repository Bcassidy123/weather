import React from 'react'
import styled, { keyframes } from 'styled-components'
import sun from '../assets/sun.svg'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;
const Img = styled.img`
  width: 250px;
  height: 250px;
  animation: ${rotate} 1s linear infinite;
`
export function Spinner(props: any) {
  return <Wrapper>
    <Img src={sun} alt="Loading" />
  </Wrapper>
}