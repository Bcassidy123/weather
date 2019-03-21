import React, { useState, useEffect, CSSProperties } from 'react'
import * as OpenWeather from '../api/openweather';
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


interface CurrentWeatherProps {
  data: OpenWeather.CurrentWeather.RootObject
}

const H2 = styled.h2`
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: center;
`
function CurrentWeather(props: CurrentWeatherProps) {
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
    justify-content: center;
  `
  return <Wrapper>
    <H2>Now</H2>
    <img
      width={250}
      height={250}
      src={process.env.PUBLIC_URL + `/assets/icons/${data.weather[0].icon}.svg`}
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

type DayForecastList = {
  dt: Date;
  temp: number;
}[];

interface DayForecastProps {
  list: {
    dt: Date;
    temp: number;
  }[];
}

function DayForecast(props: DayForecastProps) {
  const Ol = styled.ol`
    display: flex;
    list-style: none;
    justify-content: space-between;
    text-align: right;
  `
  const Li = styled.li`
    display: flex;
    flex-direction: column;
    align-items: center;
  `
  const Wrapper = styled.div`
    display: grid;
    grid-template-areas: "date list";
  `
  return <Wrapper>
    <h3>
      {props.list[0].dt.getDate()}/{props.list[0].dt.getMonth() + 1}
    </h3>
    <Ol>
      {props.list.map(x => {
        return <Li key={x.dt.getTime()}>
          <h4>{x.dt.getHours()}</h4>
          <h3>{kToC(x.temp).toFixed(1)}</h3>
        </Li>
      })}
    </Ol>
  </Wrapper>
}

interface ForecastProps {
  data: OpenWeather.Forecast.RootObject;
  days: 1 | 2 | 3 | 4 | 5;
}

function Forecast(props: ForecastProps) {
  const data = props.data.list.map(x => {
    const dt = new Date(x.dt * 1000)
    return { dt, temp: x.main.temp }
  })

  let lists: DayForecastList[] = []
  let dateString: string = ''
  for (let i = 0; i < data.length; ++i) {
    const currentDateString = data[i].dt.toLocaleDateString()
    if (dateString == currentDateString)
      continue;
    dateString = currentDateString
    lists.push(data.filter(x => x.dt.toLocaleDateString() == dateString))
  }
  lists = lists.splice(0, props.days)

  return <div>
    <H2>Forecast</H2>
    <ol>
      {lists.map(x => <li key={x[0].dt.getTime()}><DayForecast list={x} /></li>)}
    </ol>
  </div>
}

interface WeatherProps {
  cityName: string;
  countryCode: string;
}

export function Weather(props: WeatherProps) {
  const [currentWeatherData, setCurrentWeatherData] = useState(OpenWeather.defaultCurrentWeather)
  const [forecastData, setForecastData] = useState(OpenWeather.defaultForecast)
  const [details, setDetails] = useState(false)
  const [autoDetailed, setAutoDetailed] = useState(true)
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
    <Forecast data={forecastData} days={5} />
  </Wrapper>
}