import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { API } from '../shared/api';
import { ITour, ITours, ITourType } from '../models/tours';

@Injectable({
  providedIn: 'root',
})
export class ToursService {
  private tourTypeSubject = new Subject<ITourType>();
  readonly tourType$ = this.tourTypeSubject.asObservable();

  private tourDateSubject = new Subject<Date | null>();
  readonly tourDate$ = this.tourDateSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTours(): Observable<ITours> {
    return this.http.get(API.tours) as Observable<ITours>;
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
}
