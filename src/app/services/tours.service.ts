import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, Subject, switchMap } from 'rxjs';
import { API } from '../shared/api';
import { Coords, ICountriesResponseItem, ITour, ITours, ITourType } from '../models/tours';
import { WeatherService } from './weather.service';
import { IWeatherRequest } from '../models/weather';

@Injectable({
  providedIn: 'root',
})
export class ToursService {
  private tourTypeSubject = new Subject<ITourType>();
  readonly tourType$ = this.tourTypeSubject.asObservable();

  private tourDateSubject = new Subject<Date | null>();
  readonly tourDate$ = this.tourDateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private weatherService: WeatherService
  ) {}

  getTours(): Observable<ITour[]> {
    const country = this.http.get<ICountriesResponseItem[]>(API.countries);
    const tours = this.http.get<ITours>(API.tours);

    return forkJoin<[ICountriesResponseItem[], ITours]>([country, tours]).pipe(
      map((data) => {
        let toursWithCountries: ITour[] = [];
        const toursArr: ITour[] = data[1].tours;
        const countriesMap = new Map();

        data[0].forEach((itm) => countriesMap.set(itm.iso_code2, itm));

        if (Array.isArray(toursArr)) {
          toursWithCountries = toursArr.map((itm) => {
            return {
              ...itm,
              country: countriesMap.get(itm.code) || null,
            };
          });
        }
        return toursWithCountries;
      })
    );
  }

  getTourById(id: string): Observable<ITour> {
    return this.http.get(`${API.tour}/${id}`) as Observable<ITour>;
  }

  getNearestTourByLocationId(id: string): Observable<ITour[]> {
    return this.http.get<ITour[]>(API.nearestTours, {
      params: { locationId: id },
    });
  }

  searchTours(tours: ITour[], val: string): ITour[] {
    if (Array.isArray(tours)) {
      return tours.filter((itm) => {
        if (itm.name && typeof itm.name === 'string') {
          return itm.name.toLowerCase().includes(val.toLowerCase());
        } else {
          return false;
        }
      });
    } else {
      return [];
    }
  }

  initChangeTourType(type: ITourType): void {
    this.tourTypeSubject.next(type);
  }

  initChangeTourDate(date: Date | null): void {
    this.tourDateSubject.next(date);
  }

  getCountryByCode(
    code: string
  ): Observable<{ countryData: any; weatherData: IWeatherRequest }> {
    return this.http
      .get<Coords[]>(API.countryByCode, { params: { codes: code } })
      .pipe(
        map((countryDataArr) => countryDataArr[0]),

        switchMap((countryData) => {
          const coords = {
            lat: countryData.latlng[0],
            lng: countryData.latlng[1],
          };
          return this.weatherService.getWeather(coords).pipe(
            map((weatherResponse) => {
              const current = weatherResponse.current;

              const weatherData: IWeatherRequest = {
                weather: this.weatherService.getUrlImgWeather(current),
                temperature: current.temperature_2m,
              };
              return { countryData, weatherData };
            })
          );
        })
      );
  }
}
