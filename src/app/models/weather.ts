export interface IWeatherResponse {
  current: IWeatherData
}

export interface IWeatherData {
  rain: number;
  snowfall: number;
  is_day: WeatherCurrentValue;
  temperature_2m: number;
  cloud_cover: number;
}

export type WeatherCurrentValue = 0 | 1

export interface IWeatherRequest {
  temperature: number,
  weather: string
}
