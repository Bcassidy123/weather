import React, { useState, useEffect, CSSProperties } from 'react'
import { defaultCurrentWeather, OpenWeather } from '../api/openweather';

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
  return <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} >
    <dt>Temp</dt>
    <dd style={{ textAlign: "right", padding: 0, margin: 0 }}>{kToC(props.temp).toFixed(1)}&deg;C</dd>
    <dt>Temp Min</dt>
    <dd style={{ textAlign: "right", padding: 0, margin: 0 }}>{kToC(props.temp_min).toFixed(1)}&deg;C</dd>
    <dt>Temp Max</dt>
    <dd style={{ textAlign: "right", padding: 0, margin: 0 }}>{kToC(props.temp_max).toFixed(1)}&deg;C</dd>
    <dt>Pressure</dt>
    <dd style={{ textAlign: "right", padding: 0, margin: 0 }}>{props.pressure}hPa</dd>
    <dt>Humidity</dt>
    <dd style={{ textAlign: "right", padding: 0, margin: 0 }}>{props.humidity}%</dd>
    <dt>Wind</dt>
    <dd style={{ textAlign: "right", padding: 0, margin: 0 }}>{props.wind.speed}km/h {props.wind.deg}&deg;</dd>
  </dl>
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

  return <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "pink",
    borderRadius: 20,
    width: 300,
    height: 400,
  }}>
    <div style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Temperature temp={data.main.temp_min} fontSize={32} />
      <Temperature temp={data.main.temp} fontSize={48} />
      <Temperature temp={data.main.temp_max} fontSize={32} />
    </div>
    <h2>{props.cityName}, <span style={{ textTransform: "uppercase" }}>{props.countryCode}</span> </h2>
    <div style={{
      margin: 0,
      padding: 0,
      background: "none",
      width: 250,
      height: 250,
      borderRadius: 20,
      border: 0,
    }}
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
    </div>
  </div>
}