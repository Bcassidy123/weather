import React, { Component, useState, useRef, useEffect } from 'react';
import styled from 'styled-components'
import { Weather } from './components/weather'
import CountryCodes from './CountryCodes'
import * as OpenWeather from './api/openweather'

const apiKey = 'f8c4f24cc20aa33c6e45d6c1956b2b8e'
async function fetchData(countryCode: string, city: string): Promise<{ currentWeather: OpenWeather.CurrentWeather.RootObject, forecast: OpenWeather.Forecast.RootObject }> {
  const res = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${apiKey}`)
  ])
  const [currentWeather, forecast] = await Promise.all(res.map(x => x.json()))
  return {
    currentWeather,
    forecast
  }
}

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
  const [inputState, setInputState] = useState(JSON.parse(localStorage.getItem('App') || JSON.stringify({
    countryCode: 'UK', city: 'London'
  })))
  const [viewState, setViewState] = useState(JSON.parse(localStorage.getItem('Weather') || JSON.stringify({
    currentWeather: OpenWeather.defaultCurrentWeather,
    forecast: OpenWeather.defaultForecast
  })))
  useEffect(() => {
    try {
      fetchData(inputState.countryCode, inputState.city).then((state) => {
        setViewState(state)
        localStorage.setItem('Weather', JSON.stringify(state))
      })
    } catch (e) {
      console.error(e.message)
    }
  }, [inputState])

  const countryCodeRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const countryCodes = CountryCodes.map(x => x.Code)
  return <Wrapper className="App">
    <Form onSubmit={(e) => {
      e.preventDefault();
      const state = {
        countryCode: countryCodeRef!.current!.value,
        city: cityRef!.current!.value,
      }
      setInputState(state)
      localStorage.setItem('App', JSON.stringify(state))
    }} >
      <InputDiv>
        <Label>
          Country Code
        <TextInput placeholder={inputState.countryCode} list="countryCodes" required ref={countryCodeRef} />
        </Label>
        <datalist id="countryCodes">
          {countryCodes.map(x => <option key={x}>{x}</option>)}
        </datalist>
        <Label>
          City
        <TextInput placeholder={inputState.city} required ref={cityRef} />
        </Label>
      </InputDiv>
      <SubmitInput value="Search" ></SubmitInput>
    </Form>
    <Weather currentWeather={viewState.currentWeather} forecast={viewState.forecast} />
  </Wrapper>
}

export default App;
