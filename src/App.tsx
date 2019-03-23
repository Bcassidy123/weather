import React, { Component, useState, useRef, useEffect, FormEvent } from 'react';
import styled from 'styled-components'
import { Weather } from './components/weather'
import { Spinner } from './components/Spinner'
import { SomethingWentWrong } from './components/SomethingWentWrong'
import * as Countries from 'i18n-iso-countries'
import * as OpenWeather from './api/openweather'

Countries.registerLocale(require("i18n-iso-countries/langs/en.json"))
const countries = Countries.getNames("en")
const apiKey = 'f8c4f24cc20aa33c6e45d6c1956b2b8e'
async function fetchData(countryCode: string, city: string): Promise<{ currentWeather: OpenWeather.CurrentWeather.RootObject, forecast: OpenWeather.Forecast.RootObject }> {
  const res = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${apiKey}`)
  ])
  const [currentWeather, forecast] = await Promise.all(res.map(x => x.json()))
  if (currentWeather.cod == '404' || forecast.cod == '404')
    throw new Error("Bad city")
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
  box-shadow: 0px 4px;
  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.9;
    transform: translateY(3px);
    box-shadow: 0px 1px;
  }
  &:focus {
    opacity: 0.9;
    outline: none;
  }
`
const Wrapper = styled.div`
  display: grid;
  grid-template-areas: "form view";
  grid-template-columns: minmax(450px, 1fr) 2fr;
  height: 100%; 
  min-width: 450px;
  @media (max-width: 736px) {
    display: flex;
    flex-direction: column;
  }
`
interface ViewState {
  currentWeather: OpenWeather.CurrentWeather.RootObject;
  forecast: OpenWeather.Forecast.RootObject;
}
interface Status {
  loading: Boolean;
  error: Error | null;
}
function App(props: any) {
  const [inputState, setInputState] = useState(JSON.parse(localStorage.getItem('App') || JSON.stringify({
    country: 'Australia', city: 'Melbourne'
  })))
  const [viewState, setViewState] = useState<ViewState>({
    currentWeather: OpenWeather.defaultCurrentWeather,
    forecast: OpenWeather.defaultForecast
  })
  const [status, setStatus] = useState<Status>({
    loading: true,
    error: null
  })
  function getData(country: string, city: string) {
    setStatus({
      loading: true,
      error: null
    })
    return fetchData(Countries.getAlpha2Code(country, 'en'), city).then((state) => {
      setViewState(state)
      setStatus({
        loading: false,
        error: null
      })
      setInputState({
        country,
        city
      })
      localStorage.setItem('App', JSON.stringify({ country, city }))
    }).catch((e) => {
      setStatus({
        loading: false,
        error: e
      })
    })
  }
  // Run once to initialize
  useEffect(() => {
    getData(inputState.country, inputState.city)
  }, [])

  const countryRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);

  return <Wrapper className="App">
    <Form onSubmit={(e) => {
      e.preventDefault();
      getData(countryRef!.current!.value, cityRef!.current!.value)
    }}>
      <InputDiv>
        <Label>
          Country
        <TextInput placeholder={inputState.country} list="countries" required ref={countryRef} />
        </Label>
        <datalist id="countries">
          {Object.values(countries).map(x => <option key={x}>{x}</option>)}
        </datalist>
        <Label>
          City
        <TextInput placeholder={inputState.city} required ref={cityRef} />
        </Label>
      </InputDiv>
      <SubmitInput value="Search" ></SubmitInput>
    </Form>
    {status.error ? <SomethingWentWrong /> :
      status.loading ? <Spinner /> : <Weather currentWeather={viewState.currentWeather} forecast={viewState.forecast} />}
  </Wrapper>
}

export default App;
