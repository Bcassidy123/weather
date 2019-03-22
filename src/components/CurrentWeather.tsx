import React from 'react'
import styled from 'styled-components'
import * as OpenWeather from '../api/openweather'
import { kToC } from './Utility'
import { H2 } from './Common'

interface TemperatureProps {
  temp: number;
  fontSize: number;
}

function Temperature(props: TemperatureProps) {
  return <p style={{ padding: 0, margin: 0, fontSize: props.fontSize }}>
    {kToC(props.temp).toFixed(1)}
  </p>
}

interface DetailedProps {
  temp: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  wind: OpenWeather.CurrentWeather.Wind;
}

function Detailed(props: DetailedProps) {
  const Dd = styled.dd`
    text-align: right;
    padding: 0; 
    margin: 0; 
  `
  const Dl = styled.dl`
    display: grid;
    grid-template-columns: 1fr 1fr;
  `
  return <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} >
    <dt>Temp</dt>
    <Dd>{kToC(props.temp).toFixed(1)}&deg;C</Dd>
    <dt>Temp Min</dt>
    <Dd>{kToC(props.temp_min).toFixed(1)}&deg;C</Dd>
    <dt>Temp Max</dt>
    <Dd>{kToC(props.temp_max).toFixed(1)}&deg;C</Dd>
    <dt>Pressure</dt>
    <Dd>{props.pressure}hPa</Dd>
    <dt>Humidity</dt>
    <Dd>{props.humidity}%</Dd>
    <dt>Wind</dt>
    <Dd>{props.wind.speed}km/h {props.wind.deg}&deg;</Dd>
  </dl>
}


export interface CurrentWeatherProps {
  data: OpenWeather.CurrentWeather.RootObject
}

export default function CurrentWeather(props: CurrentWeatherProps) {
  const { data } = props;

  const Temperatures = styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
  `
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `
  return <Wrapper>
    <H2>Now</H2>
    <img
      width={250}
      height={250}
      src={process.env.PUBLIC_URL + `/assets/icons/${data.weather[0].icon}.svg`}
      alt={data.weather[0].description}
      title={data.weather[0].description}
    />
    <Temperatures>
      <Temperature temp={data.main.temp_min} fontSize={32} />
      <Temperature temp={data.main.temp} fontSize={48} />
      <Temperature temp={data.main.temp_max} fontSize={32} />
    </Temperatures>
    <Detailed
      temp={data.main.temp}
      temp_min={data.main.temp_min}
      temp_max={data.main.temp_max}
      pressure={data.main.pressure}
      humidity={data.main.humidity}
      wind={data.wind}
    />
  </Wrapper>
}