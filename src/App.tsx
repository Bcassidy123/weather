import React, { Component, useState, useRef } from 'react';
import styled from 'styled-components'
import { Weather } from './components/weather'
import CountryCodes from './CountryCodes'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 2em;
  background: turquoise;
  justify-content: center;
`
const Label = styled.label`
  display: flex;
  flex-direction: column;
  user-select: none;
`
const TextInput = styled.input.attrs({
  type: "text",
})`
  font-size: 32px;
  border: 0;
  background: none;
  border-bottom: 1px solid black;
`
const InputDiv = styled.div`
  margin: 1em;
`
const SubmitInput = styled.input.attrs({
  type: 'submit'
})`
  font-size: 32px;
  width: 33%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  border:0;
  padding: 10px;
`
const Wrapper = styled.div`
  display: grid;
  grid-template-areas: "form view";
  grid-template-columns: minmax(400px, 1fr) 2fr;
  height: 100%;
`
function App(props: any) {
  const previousApp = localStorage.getItem('App')
  let defaultState = { countryCode: 'UK', city: 'London' }
  if (previousApp)
    defaultState = JSON.parse(previousApp)
  const [data, setData] = useState(defaultState);
  const countryCodeRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const countryCodes = CountryCodes.map(x => x.Code)
  return <Wrapper className="App">
    <Form onSubmit={(e) => {
      e.preventDefault();
      setData({
        countryCode: countryCodeRef!.current!.value,
        city: cityRef!.current!.value,
      })
      localStorage.setItem('App', JSON.stringify({
        countryCode: countryCodeRef!.current!.value,
        city: cityRef!.current!.value,
      }))
    }} >
      <InputDiv>
        <Label>
          Country Code
        <TextInput placeholder={data.countryCode} list="countryCodes" required ref={countryCodeRef} />
        </Label>
        <datalist id="countryCodes">
          {countryCodes.map(x => <option key={x}>{x}</option>)}
        </datalist>
        <Label>
          City
        <TextInput placeholder={data.city} required ref={cityRef} />
        </Label>
      </InputDiv>
      <SubmitInput value="Search" ></SubmitInput>
    </Form>
    <Weather cityName={data.city} countryCode={data.countryCode} />
  </Wrapper>
}

export default App;
