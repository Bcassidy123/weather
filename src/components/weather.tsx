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
  const [data, setData] = useState({
    currentWeather: OpenWeather.defaultCurrentWeather,
    forecast: OpenWeather.defaultForecast
  })
  useEffect(() => {
    Promise.all([
      fetch(`https://samples.openweathermap.org/data/2.5/weather?q=${props.cityName},${props.countryCode}&appid=b6907d289e10d714a6e88b30761fae22`),
      fetch(`https://samples.openweathermap.org/data/2.5/forecast?q=${props.cityName},${props.countryCode}&appid=b6907d289e10d714a6e88b30761fae22`)
    ]).then(res => {
      Promise.all(res.map(res => res.json()))
        .then(([currentWeather, forecast]) => {
          if (currentWeather.cod == "404" || forecast.cod == "404")
            return;
          setData({ currentWeather, forecast })
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