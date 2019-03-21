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

  return <div>
    <H2>Forecast</H2>
    <ol>
      {lists.map(x => <li key={x[0].dt.getTime()}><DayForecast list={x} /></li>)}
    </ol>
  </div>
}