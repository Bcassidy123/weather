import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'
import * as OpenWeather from '../api/openweather'
import { kToC } from './Utility'
import { H2 } from './Common'

type ForecastPoint = {
  dt: Date;
  temp: number;
  icon: string;
  description: string;
}
type ForecastList = ForecastPoint[]

interface ForecastChartProps {
  lists: ForecastList;
  width: number;
  height: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }
}
function ForecastChart(props: ForecastChartProps) {
  const { lists, width, height, margin = { top: 20, right: 20, bottom: 20, left: 20 } } = props;
  const minTemp = Math.min(...(lists.map(x => x.temp))) - 1
  const maxTemp = Math.min(...(lists.map(x => x.temp))) + 1
  type Point = {
    x: Date;
    y: number;
  }
  const ps = lists.map(x => ({ x: x.dt, y: kToC(x.temp) }))

  const xExtent = d3.extent(ps, p => p.x)
  const yExtent = d3.extent(ps, p => p.y)

  const xScale = d3.scaleTime().range([margin.left, width - margin.right]).domain([xExtent[0]!, xExtent[1]!])
  const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]).domain([yExtent[0]! - 1, yExtent[1]! + 1])

  const xAxis = d3.axisBottom(xScale).tickValues(lists.map(x => x.dt)).tickFormat((x: any) => d3.timeFormat("%I")(x))
  const yAxis = d3.axisLeft(yScale)

  const lineGenerator = d3.line<Point>();
  lineGenerator.x(p => xScale(p.x))
  lineGenerator.y(p => yScale(p.y))
  const points = lineGenerator(ps);

  const xAxisRef = useRef<any>(null)
  const yAxisRef = useRef<any>(null)

  useEffect(() => {
    d3.select(xAxisRef.current).call(xAxis)
    d3.select(yAxisRef.current).call(yAxis)
  }, [props])

  return <svg width={width} height={height}> console.log("something")}>
    <path d={points!} fill='none' stroke='red' strokeWidth='3' />
    <g>
      {ps.map(p => <circle key={xScale(p.x)} cx={xScale(p.x)} cy={yScale(p.y)} r={3} fill="black" stroke="black" />)}
    </g>
    <g>
      <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
      <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
    </g>
  </svg>
}

interface DayForecastProps {
  list: ForecastList; // length > 4
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
    <img
      width={100}
      height={100}
      src={process.env.PUBLIC_URL + `/assets/icons/${forecast.icon}.svg`}
      alt={forecast.description}
      title={forecast.description}
    />
    <h3>{kToC(averageTemp).toFixed(1)}</h3>
  </Wrapper>
}

export interface ForecastProps {
  data: OpenWeather.Forecast.RootObject;
}

export default function Forecast(props: ForecastProps) {
  const data = props.data.list.map(x => {
    const dt = new Date(x.dt * 1000)
    return { dt, temp: x.main.temp, icon: x.weather[0].icon, description: x.weather[0].description }
  })

  let lists: ForecastList[] = []
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
  const Wrapper = styled.div`
    display: flex;
    flex-direction:column;
    align-items: center;
  `
  return <Wrapper>
    <H2>Forecast</H2>
    <Ol>
      {middayLists.map(x => <li key={x[0].dt.getTime()}><MidDayForecast list={x} /></li>)}
    </Ol>
    <ForecastChart lists={lists.flat()} width={600} height={300} />
  </Wrapper>
}