import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { FilesResponse } from '../../interfaces/Files';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  filesUrl = environment.backendUrl + 'files/v1';

  constructor(private http: HttpClient) {}

  getAllFiles(): Observable<FilesResponse> {
    return this.http.get<FilesResponse>(this.filesUrl);
  }
}
