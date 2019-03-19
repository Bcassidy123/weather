export declare module OpenWeather {

  export interface Coord {
    lon: number;
    lat: number;
  }

  export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
  }

  export interface Main {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  }

  export interface Wind {
    speed: number;
    deg: number;
  }

  export interface Clouds {
    all: number;
  }

  export interface Sys {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  }

  export interface CurrentWeather {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    id: number;
    name: string;
    cod: number;
  }
}

export const defaultCurrentWeather: OpenWeather.CurrentWeather = { "coord": { "lon": -0.13, "lat": 51.51 }, "weather": [{ "id": 300, "main": "Drizzle", "description": "light intensity drizzle", "icon": "09d" }], "base": "stations", "main": { "temp": 280.32, "pressure": 1012, "humidity": 81, "temp_min": 279.15, "temp_max": 281.15 }, "visibility": 10000, "wind": { "speed": 4.1, "deg": 80 }, "clouds": { "all": 90 }, "dt": 1485789600, "sys": { "type": 1, "id": 5091, "message": 0.0103, "country": "GB", "sunrise": 1485762037, "sunset": 1485794875 }, "id": 2643743, "name": "London", "cod": 200 }

