import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpParams, HttpRequest} from "@angular/common/http";
import {MeasList} from "../../models/meas-list";
import {Observable} from "rxjs";
import {MeasData} from "../../models/meas-data";
import {MetaInf} from "../../models/meta-inf";

@Injectable({
  providedIn: 'root'
})
export class MeasService {
  private usersUrl: string;
  constructor(private http: HttpClient) {
    this.usersUrl = 'http://localhost:9005';
  }

  getMeasByNames(names: string[], start: number, end: number): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('names', names.toString());
    formData.append('start', start.toString());
    formData.append('end', end.toString());

    const req = new HttpRequest('POST', `${this.usersUrl}/data/get-data`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  public getMeasNames(): Observable<string[]> {
    return this.http.get<string[]>(this.usersUrl + "/data/names");
  }

  public getMetaInf(): Observable<MetaInf> {
    return this.http.get<MetaInf>(this.usersUrl + "/data/meta-inf");
  }

  public analise(phA: string, phB: string, phC: string, stock?: number): Observable<MeasData> {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("phAName",phA);
    queryParams = queryParams.append("phBName",phB);
    queryParams = queryParams.append("phCName",phC);

    if (stock != null) {
      queryParams = queryParams.append("stock",stock);
    }

    return this.http.get<MeasData>(this.usersUrl + "/data/analise", {params:queryParams});
  }

}

