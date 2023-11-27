import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = 'http://localhost:9005';
  constructor(private http: HttpClient) { }

  uploadCsv(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('csv', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/file/upload/csv`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  uploadComtrade(cfg: File, dat: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('cfg', cfg);
    formData.append('dat', dat);

    const req = new HttpRequest('POST', `${this.baseUrl}/file/upload/comtrade`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
