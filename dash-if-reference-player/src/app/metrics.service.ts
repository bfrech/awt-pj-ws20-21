import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * This service provides communication between sibling components metrics-configuration and metrics-view
 */

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  constructor() { }

  /** Observable source */
  private updateMetricsSelectionCallSource = new Subject<any>();

  /** Observable stream */
  updateMetricsSelectionCalled$ = this.updateMetricsSelectionCallSource.asObservable();

  /** Service method */
  updateMetricsSelection(selectedOptionKeys: Array<string>): void {
    this.updateMetricsSelectionCallSource.next(selectedOptionKeys);
  }

}
