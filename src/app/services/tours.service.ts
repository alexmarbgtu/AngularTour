import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, forkJoin, map, Observable, of, Subject, switchMap, tap, withLatestFrom } from 'rxjs';
import { API } from '../shared/api';
import { Coords, ICountriesResponseItem, ITour, ITours, ITourType } from '../models/tours';
import { WeatherService } from './weather.service';
import { IWeatherRequest } from '../models/weather';
import { LoaderService } from './loader.service';
import { IOrder } from '../models/order';
import { BasketService } from './Basket.service';

@Injectable({
  providedIn: 'root',
})
export class ToursService {
  private tourTypeSubject = new Subject<ITourType>();
  readonly tourType$ = this.tourTypeSubject.asObservable();

  private tourDateSubject = new Subject<Date | null>();
  readonly tourDate$ = this.tourDateSubject.asObservable();

  private toursInBasketSubject = new Subject<boolean | null>();
  readonly toursInBasket$ = this.toursInBasketSubject.asObservable();

  private typeSelectedTours: ITourType = null;

  get getTypeSearchTours(): ITourType {
    return this.typeSelectedTours;
  }

  private dateSelectedTours: Date = null;

  get getDateSearchTours(): Date {
    return this.dateSelectedTours;
  }

  constructor(
    private http: HttpClient,
    private weatherService: WeatherService,
    private loaderService: LoaderService,
    private basketService: BasketService
  ) {}

  getTours(): Observable<ITour[]> {
    // set loader
    this.loaderService.setLoader(true);

    const country = this.http.get<ICountriesResponseItem[]>(API.countries);
    const tours = this.http.get<ITours>(API.tours, {
      headers: {
        Authorization: 'verbose',
      },
    });

    // parralel
    return forkJoin<[ICountriesResponseItem[], ITours]>([country, tours]).pipe(
      delay(500), // TODO pause 1s
      withLatestFrom(this.basketService.basketStore$),
      map(([data, basketData]) => {
        let toursWithCountries: ITour[] = [];
        const toursArr: ITour[] = data[1].tours;
        const countriesMap = new Map();

        data[0].forEach((itm) => countriesMap.set(itm.iso_code2, itm));

        if (Array.isArray(toursArr)) {
          toursWithCountries = toursArr.map((itm) => {
            const findTourBasket = basketData.find(
              (itmBasket) => itmBasket.id === itm.id
            );
            if (findTourBasket) itm.inBasket = true;
            itm.sum = parseInt(itm.price.replace(/[^0-9\s]/gi, ''));
            itm.currency = itm.price.substring(0,1);
            // console.log(itm);

            return {
              ...itm,
              country: countriesMap.get(itm.code) || null,
            };
          });
        }
        return toursWithCountries;
      }),
      tap(() => {
        //hide loader
        this.loaderService.setLoader(false);
      }),
      catchError((err) => {
        this.loaderService.setLoader(false);
        return of(null);
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
    this.typeSelectedTours = type;
  }

  initChangeTourDate(date: Date | null): void {
    this.tourDateSubject.next(date);
    this.dateSelectedTours = date;
  }

  initChangeTourShowInBasket(show: boolean | null): void {
    this.toursInBasketSubject.next(show);
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
              console.log('weather', current);

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

  deleteTour(id: string): Observable<ITour[]> {
    return this.http.delete<ITour[]>(API.deleteTour + id);
  }

  postOrder(orderBody: IOrder): Observable<any> {
    return this.http.post(API.order, orderBody);
  }
}
