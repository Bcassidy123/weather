import React from 'react'
import styled from 'styled-components'
import * as OpenWeather from '../api/openweather'
import { kToC } from './Utility'
import { H2 } from './Common'

type DayForecastList = {
  dt: Date;
  temp: number;
}[];

interface DayForecastProps {
  list: {
    dt: Date;
    temp: number;
  }[]; // length > 4
}

function MidDayForecast(props: DayForecastProps) {
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `
  const forecast = props.list[4]
  const averageTemp = (props.list[3].temp + props.list[4].temp) / 2;
  return <Wrapper>
    <h3>{forecast.dt.getDate()}/{forecast.dt.getMonth() + 1}</h3>
    <h3>{kToC(averageTemp).toFixed(1)}</h3>
  </Wrapper>
}

export interface ForecastProps {
  data: OpenWeather.Forecast.RootObject;
}

export default function Forecast(props: ForecastProps) {
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
  const middayLists = lists.filter(x => x.length > 4)

  const Ol = styled.ol`
    display: flex;
    list-style: none;
    justify-content: space-between;
    text-align: center;
  `
  const Li = styled.li`
    display: flex;
    flex-direction: column;
    align-items: center;
  `
  return <div>
    <H2>Forecast</H2>
    <Ol>
      {middayLists.map(x => <li key={x[0].dt.getTime()}><MidDayForecast list={x} /></li>)}
    </Ol>
  </div>
}