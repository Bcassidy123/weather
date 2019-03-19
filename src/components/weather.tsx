import React, { useState, useEffect } from 'react'
import { defaultCurrentWeather, OpenWeather } from '../api/openweather';

function fToC(deg: number) {
  return (deg - 32) * 5 / 9
}
function kToC(deg: number) {
  return deg - 273.15
}

interface WeatherProps {
  cityName: string;
  countryCode: string;
}

export function Weather(props: WeatherProps) {
  const [data, setData] = useState(defaultCurrentWeather)
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
      <h3>{kToC(data.main.temp_min).toFixed(1)}</h3>
      <h1>{kToC(data.main.temp).toFixed(1)}</h1>
      <h3>{kToC(data.main.temp_max).toFixed(1)}</h3>
    </div>
    <h2>{props.cityName}, <span style={{ textTransform: "uppercase" }}>{props.countryCode}</span> </h2>
  </div>
}