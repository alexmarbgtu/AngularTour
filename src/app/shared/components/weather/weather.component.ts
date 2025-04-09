import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input } from '@angular/core';
import { ILocation } from '../../../models/tours';

@Component({
  selector: 'app-weather',
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements AfterViewInit {
  @Input() location: ILocation;

  params = {
    latitude: 0,
    longitude: 0,
    current: [
      'precipitation',
      'temperature_2m',
      'is_day',
      'rain',
      'snowfall',
      'cloud_cover',
    ],
  };
  url = 'https://api.open-meteo.com/v1/forecast';

  weather: any = null;
  urlImg: string = null

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.params.latitude = this.location.lat;
    this.params.longitude = this.location.lng;
    this.http.get(this.url, { params: this.params }).subscribe((data: any) => {
      if (data.current) {
        this.weather = data.current;

        if (this.weather.rain > 0 || this.weather.snowfall > 0) {
          if (this.weather.rain > 0 && this.weather.snowfall > 0) {
            this.urlImg = 'ra_sn.svg';
          } else if (this.weather.rain > 0 && this.weather.snowfall == 0) {
            this.urlImg = 'ra.svg';
          } else this.urlImg = 'sn.svg';
        } else {
          if (this.weather.cloud_cover === 0) {
            this.urlImg = this.weather.is_day ? 'sun.svg' : 'skc_n.svg';
          } else if (this.weather.cloud_cover < 50) {
            this.urlImg = this.weather.is_day ? 'd.svg' : 'mo_d.svg';
          } else this.urlImg = 'ovc.svg';
        }
      }
    });
  }


}
