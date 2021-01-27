import { Component } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MetricsService } from '../../services/metrics.service';
import { MetricOption, METRICOPTIONS } from '../../metrics';


@Component({
  selector: 'app-metrics-configuration',
  templateUrl: './metrics-configuration.component.html',
  styleUrls: ['./metrics-configuration.component.css']
})
export class MetricsConfigurationComponent {

  /** What metrics can be selected to be displayed */
  options: MetricOption[] = METRICOPTIONS;

  /** What options are selected */
  selectedOptionKeys: Array<string> = [];

  /** Max allowed number of selected options */
  maxNumOfSelectedOptions = 5;
  messageTooManySelections = `Please select a maximum of ${this.maxNumOfSelectedOptions} metrics only.`;


  constructor( private snackBar: MatSnackBar,
               private metricsService: MetricsService ) { }

  /** Handle selection change */
  optionChange(checkbox: MatCheckbox, event: MatCheckboxChange, key: string, typeKey: 'audio' | 'video'): void {

    const fullKey = `${key}.${typeKey}`;

    if (event.checked) {
      /** Option was selected. If more is allowed, push its key into the selectedOptions array and send to service */
      if (this.selectedOptionKeys.length < this.maxNumOfSelectedOptions ) {
        this.selectedOptionKeys.push(fullKey);
        this.metricsService.updateMetricsSelection(this.selectedOptionKeys);
      }
      else {
        /** That is too many. Unselect element and show a snack-bar note. */
        checkbox.checked = false;
        this.snackBar.open(this.messageTooManySelections, '', { duration: 3000 });
      }
    }
    else {
      /** Option was un-selected. Search and remove its key from the selectedOptions array and send to service */
      const idx = this.selectedOptionKeys.indexOf(fullKey);

      if (idx > -1) {
        this.selectedOptionKeys.splice(idx, 1);
        this.metricsService.updateMetricsSelection(this.selectedOptionKeys);
      }
    }

  }
}
