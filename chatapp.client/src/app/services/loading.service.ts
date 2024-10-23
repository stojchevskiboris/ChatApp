import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  public getLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
