import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../shared/api';
import { ITour } from '../models/tours';

@Injectable({
  providedIn: 'root',
})
export class ToursService {
  constructor(private http: HttpClient) {}

  getTours() {
    return this.http.get(API.tours) as Observable<ITour[]>
  };
}
