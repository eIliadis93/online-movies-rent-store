import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {
  private isMobileSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isMobile());
  isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();

  constructor() {
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize.bind(this));
  }

  private isMobile(): boolean {
    return window.innerWidth <= 600;
  }

  private checkWindowSize(): void {
    this.isMobileSubject.next(this.isMobile());
  }
}
