import React, { useState, useEffect } from 'react'
import * as OpenWeather from '../api/openweather';
import styled from 'styled-components';
import CurrentWeather from './CurrentWeather'
import Forecast from './Forecast'
import { H1 } from './Common'

const CountryCode = styled.span`
  text-transform: uppercase;
`
const CountryName = styled.span`
  text-transform: capitalize;
`
const DataDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`
const Heading = styled(H1)`
  grid-area: heading;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

interface WeatherProps {
  cityName: string;
  countryCode: string;
}

export function Weather(props: WeatherProps) {
  const previousWeather = localStorage.getItem('Weather')
  let defaultState = {
    currentWeather: OpenWeather.defaultCurrentWeather,
    forecast: OpenWeather.defaultForecast
  }
  if (previousWeather) {
    defaultState = JSON.parse(previousWeather)
  }
  const [data, setData] = useState(defaultState)

  useEffect(() => {
    Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${props.cityName},${props.countryCode}&appid=f8c4f24cc20aa33c6e45d6c1956b2b8e`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${props.cityName},${props.countryCode}&appid=f8c4f24cc20aa33c6e45d6c1956b2b8e`)
    ]).then(res => {
      Promise.all(res.map(res => res.json()))
        .then(([currentWeather, forecast]) => {
          if (currentWeather.cod == "404" || forecast.cod == "404")
            return;
          setData({ currentWeather, forecast })
          localStorage.setItem('Weather', JSON.stringify({ currentWeather, forecast }))
        })
    })
  }, [props.cityName, props.countryCode])

  return <Wrapper>
    <Heading>
      <CountryCode>{data.currentWeather.sys.country}</CountryCode>, <CountryName>{data.currentWeather.name}</CountryName>
    </Heading>
    <DataDiv>
      <CurrentWeather data={data.currentWeather} />
      <Forecast data={data.forecast} />
    </DataDiv>
  </Wrapper>
}