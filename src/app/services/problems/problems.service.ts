import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Problem, ProblemsResponse } from '../../interfaces/Problems';

@Injectable({
  providedIn: 'root',
})
export class ProblemsService {
  constructor(private http: HttpClient) {}

  filesUrl: string = environment.backendUrl + 'files/v1';

  getProblems(fileId: string) {
    return this.http.get<ProblemsResponse>(this.filesUrl + `/${fileId}`);
  }

  updateProblems(fileId: string, problems: Problem[]) {
    let body = {
      problems: problems,
    };
    return this.http.put(this.filesUrl + `/${fileId}`, body,{
      responseType:"text"
    });
  }
}
