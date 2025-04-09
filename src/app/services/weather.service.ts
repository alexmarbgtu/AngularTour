import { Injectable } from '@angular/core';
import { ILocation } from '../models/tours';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IWeatherData, IWeatherResponse } from '../models/weather';
import { API } from '../shared/api';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeather(location: ILocation): Observable<IWeatherResponse> {
    const params = {
      latitude: location.lat,
      longitude: location.lng,
      current: [
        'precipitation',
        'temperature_2m',
        'is_day',
        'rain',
        'snowfall',
        'cloud_cover',
      ],
    };
    return this.http.get<IWeatherResponse>(API.getWeather, {params})
  }

  getUrlImgWeather(weather: IWeatherData): string {
    let url: string = null
    if (weather.rain > 0 || weather.snowfall > 0) {
      if (weather.rain > 0 && weather.snowfall > 0) {
        url = 'ra_sn.svg';
      } else if (weather.rain > 0 && weather.snowfall == 0) {
        url = 'ra.svg';
      } else url = 'sn.svg';
    } else {
      if (weather.cloud_cover === 0) {
        url = weather.is_day ? 'sun.svg' : 'skc_n.svg';
      } else if (weather.cloud_cover < 50) {
        url = weather.is_day ? 'd.svg' : 'mo_d.svg';
      } else url = 'ovc.svg';
    }
    return url
  }

}
