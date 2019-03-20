import React, { useState, useEffect, CSSProperties } from 'react'
import { defaultCurrentWeather, OpenWeather } from '../api/openweather';
import styled from 'styled-components';

function fToC(deg: number) {
  return (deg - 32) * 5 / 9
}
function kToC(deg: number) {
  return deg - 273.15
}

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
  wind: OpenWeather.Wind;
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


interface CurrentWeatherProps {
  data: OpenWeather.CurrentWeather
}

function CurrentWeather(props: CurrentWeatherProps) {
  const { data } = props;
  const [details, setDetails] = useState(false)
  const [autoDetailed, setAutoDetailed] = useState(true)

  const Temperatures = styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
  `
  const Details = styled.div`
      margin: 0;
      padding: 0;
      background: none;
      width: 250px;
      height: 250px;
  `
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `
  return <Wrapper >
    <Temperatures>
      <Temperature temp={data.main.temp_min} fontSize={32} />
      <Temperature temp={data.main.temp} fontSize={48} />
      <Temperature temp={data.main.temp_max} fontSize={32} />
    </Temperatures>
    <Details
      onMouseEnter={() => autoDetailed && setDetails(true)}
      onMouseLeave={() => autoDetailed && setDetails(false)}
    >
      <img
        hidden={details}
        width={250}
        height={250}
        src={process.env.PUBLIC_URL + `/assets/icons/${data.weather[0].icon}.svg`}
      />
      <div hidden={!details}>
        <Detailed
          temp={data.main.temp}
          temp_min={data.main.temp_min}
          temp_max={data.main.temp_max}
          pressure={data.main.pressure}
          humidity={data.main.humidity}
          wind={data.wind}
        />
      </div>
    </Details>
  </Wrapper>
}


interface WeatherProps {
  cityName: string;
  countryCode: string;
}

export function Weather(props: WeatherProps) {
  const [data, setData] = useState(defaultCurrentWeather)
  const [details, setDetails] = useState(false)
  const [autoDetailed, setAutoDetailed] = useState(true)
  useEffect(() => {
    fetch(`https://samples.openweathermap.org/data/2.5/weather?q=${props.cityName},${props.countryCode}&appid=b6907d289e10d714a6e88b30761fae22`)
      .then(res => {
        console.log(res)
        if (res.ok) {
          res.json().then((json: OpenWeather.CurrentWeather) => {
            setData(json)
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
      "heading"
      "current";
  `
  return <Wrapper>
    <h2>
      <CountryCode>{props.countryCode}</CountryCode>
      <br />
      <CountryName>{props.cityName}</CountryName>
    </h2>
    <CurrentWeather data={data} />
  </Wrapper>
}