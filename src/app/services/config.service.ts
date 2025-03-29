import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API } from '../shared/api';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  static config: any;
  jsonFile = `${API.config}`;

  constructor(private http: HttpClient) {}

  loadObservable(): Observable<any> {
    return this.http.get(this.jsonFile).pipe(
      tap((data) => {

      })
    );
  }

  loadPromise(): Promise<any> {
    const configPromise: Promise<any> = new Promise((resolve, reject) => {
      this.http.get(this.jsonFile).toPromise().then((response: any) => {

        if (response && typeof(response) === 'object') {

          if (Array.isArray(response?.rules)) {
            ConfigService.config = response;
            resolve(response);
          } else {
            reject(
              `Ошибка при загрузки файла - rules не массив, '${this.jsonFile}': ${JSON.stringify(
                response
              )}`
            );
          }

        } else {
          reject(
            `Ошибка при загрузки файла '${this.jsonFile}': ${JSON.stringify(
              response
            )}`
          );
        }

      })
      .catch((response: any) => {
        reject ( `Ошибка при загрузки файла - response не объект, '${this.jsonFile}': ${JSON.stringify(response)}` );
      })
    })

    return Promise.all([configPromise])
  }
}
