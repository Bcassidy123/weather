import React, { Component } from 'react';
import { Weather } from './components/weather'

function App(props: any) {
  return <div className="App">
    <Weather cityName="London" countryCode="uk" />
  </div>
}

export default App;
