import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FileView} from "../../models/file-view";
import {Measurement, Range} from "../../models/measurement";
import {FaultPhasesNumber} from "../../models/fault-phases-number";
import {FaultData} from "../../models/fault-data";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:9005';

  constructor(private http: HttpClient) { }

  public getMeasWithValuesByRange(id: string, signalNumber: number[], range: Range): Observable<Measurement[]> {
    return this.http.post<Measurement[]>(
      `${this.baseUrl}/file/${id}/measurements`,
      new NumbersAndRange(signalNumber, range));
  }

  public getMeasurementsInfo(id: string): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.baseUrl}/file/${id}/measurements/info`);
  }

  public getFileInfo(id: string): Observable<FileView> {
    return this.http.get<FileView>(`${this.baseUrl}/file/${id}/info`);
  }

  public getFilesInfo(): Observable<FileView[]> {
    return this.http.get<FileView[]>(`${this.baseUrl}/files`);
  }

  public deleteFile(id: string): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/file/${id}/delete`);
  }

  public analise(id: string, faultPhasesNumber: FaultPhasesNumber): Observable<FaultData> {
    return this.http.post<FaultData>(
      `${this.baseUrl}/file/${id}/analise`,
      faultPhasesNumber);
  }
}

class NumbersAndRange {
  signalNumber:number[]
  range:Range
  constructor(signalNumber: number[], range: Range) {
    this.signalNumber = signalNumber;
    this.range = range;
  }
}

