import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor() { }


  // Observable sources
  private playerStopCallSource = new Subject<any>();
  private playerLoadCallSource = new Subject<any>();


  // Observable streams
  playerStopCalled$ = this.playerStopCallSource.asObservable();
  playerLoadCalled$ = this.playerLoadCallSource.asObservable();


  // Service methods
  stop(): void {
    this.playerStopCallSource.next();
  }

  load(streamAddr: string | undefined): void {
    this.playerLoadCallSource.next(streamAddr);
  }

}
