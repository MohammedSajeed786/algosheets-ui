import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {}

  showLoader = new BehaviorSubject<boolean>(false);

  showLoader$ = this.showLoader.asObservable();

  startLoader() {
    this.showLoader.next(true);
  }

  stopLoader() {
    this.showLoader.next(false);
  }
}
