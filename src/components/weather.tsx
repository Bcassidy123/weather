import React, { useState, useEffect } from 'react'
import * as OpenWeather from '../api/openweather';
import styled from 'styled-components';
import CurrentWeather from './CurrentWeather'
import Forecast from './Forecast'

interface WeatherProps {
  cityName: string;
  countryCode: string;
}

export function Weather(props: WeatherProps) {
  const [currentWeatherData, setCurrentWeatherData] = useState(OpenWeather.defaultCurrentWeather)
  const [forecastData, setForecastData] = useState(OpenWeather.defaultForecast)
  useEffect(() => {
    fetch(`https://samples.openweathermap.org/data/2.5/weather?q=${props.cityName},${props.countryCode}&appid=b6907d289e10d714a6e88b30761fae22`)
      .then(res => {
        console.log(res)
        if (res.ok) {
          res.json().then((json: OpenWeather.CurrentWeather.RootObject) => {
            setCurrentWeatherData(json)
          })
        } else {
          console.log(res.statusText)
        }
      }).catch((e) => {
        console.log(e.message)
      })
    fetch(`http://samples.openweathermap.org/data/2.5/forecast?q=${props.cityName},${props.countryCode}&appid=b6907d289e10d714a6e88b30761fae22`)
      .then(res => {
        console.log(res)
        if (res.ok) {
          res.json().then((json: OpenWeather.Forecast.RootObject) => {
            setForecastData(json)
          })
        } else {
          console.log(res.statusText)
        }
      }).catch((e) => {
        console.log(e.message)
      })
  }, [props.cityName, props.countryCode])

  const CountryCode = styled.span`
    text-transform: uppercase;
  `
  const CountryName = styled.span`
    text-transform: capitalize;
  `
  const Wrapper = styled.div`
    display: grid;
    grid-template-areas:
      "heading heading"
      "current forecast";
  `
  const Heading = styled.h2`
    grid-area: heading;
  `
  return <Wrapper>
    <Heading>
      <CountryCode>{props.countryCode}</CountryCode>
      <br />
      <CountryName>{props.cityName}</CountryName>
    </Heading>
    <CurrentWeather data={currentWeatherData} />
    <Forecast data={forecastData} />
  </Wrapper>
}