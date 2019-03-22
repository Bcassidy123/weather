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
  @media (max-width: 736px) {
    display: flex;
    flex-direction: column;
  }
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
  currentWeather: OpenWeather.CurrentWeather.RootObject;
  forecast: OpenWeather.Forecast.RootObject;
}
export function Weather(props: WeatherProps) {
  return <Wrapper>
    <Heading>
      <CountryCode>{props.currentWeather.sys.country}</CountryCode>, <CountryName>{props.currentWeather.name}</CountryName>
    </Heading>
    <DataDiv>
      <CurrentWeather data={props.currentWeather} />
      <Forecast data={props.forecast} />
    </DataDiv>
  </Wrapper>
}