import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor() { }


  // Observable sources
  private playerStopCallSource = new Subject<any>();
  private playerLoadCallSource = new Subject<any>();
  private playerTriggerMetricsUpdateSource = new Subject<any>();
  private playerSendMetricsSource = new Subject<any>();


  // Observable streams
  playerStopCalled$ = this.playerStopCallSource.asObservable();
  playerLoadCalled$ = this.playerLoadCallSource.asObservable();
  playerTriggerMetricsUpdateCalled$ = this.playerTriggerMetricsUpdateSource.asObservable();
  playerSendMetricsCalled$ = this.playerSendMetricsSource.asObservable();


  // Service methods
  stop(): void {
    this.playerStopCallSource.next();
  }

  load(streamAddr: string | undefined): void {
    this.playerLoadCallSource.next(streamAddr);
  }

  triggerMetricsUpdate(): void {
    this.playerTriggerMetricsUpdateSource.next();
  }

  sendMetrics(buffer: number): void {
    this.playerSendMetricsSource.next(buffer);
  }

}
