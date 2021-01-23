import {Component} from '@angular/core';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Interface for selectable metric options */
interface MetricOption { name: string; type: 'a' | 'v' | 'av'; key: string; }


@Component({
  selector: 'app-metrics-configuration',
  templateUrl: './metrics-configuration.component.html',
  styleUrls: ['./metrics-configuration.component.css']
})
export class MetricsConfigurationComponent {

  /** What metrics can be selected to be displayed */
  options: MetricOption[] = [
    { name: 'Buffer Length', type: 'av', key: 'bufferLevel' },
    { name: 'Bitrate Downloading', type: 'av', key: 'bitrateDownload' },
    { name: 'Quality Index', type: 'av', key: 'qualityIndex' },
    { name: 'Quality Index Pending', type: 'av', key: 'qualityIndexPending' },
    { name: 'Dropped Frames', type: 'av', key: 'droppedFrames' },
    { name: 'Download Time', type: 'av', key: 'segDownloadTime' },
    { name: 'Playback Ratio', type: 'av', key: 'playbackDownloadTimeRatio' },
    { name: 'Latency', type: 'av', key: 'latency' },
    { name: 'Live Latency', type: 'a', key: 'liveLatency' }
  ];

  /** What options are selected */
  selectedOptions: Array<string> = [];

  /** Max allowed number of selected options */
  maxNumOfSelectedOptions = 5;
  messageTooManySelections = `Please select ${this.maxNumOfSelectedOptions} options only.`;


  constructor(private snackBar: MatSnackBar) { }

  /** Handle selection change */
  optionChange(checkbox: MatCheckbox, event: MatCheckboxChange, key: string, typeKey: 'audio' | 'video'): void {

    const fullKey = `${key}.${typeKey}`;

    if (event.checked) {
      /** Option was selected. If more is allowed, push its key into the selectedOptions array */
      if (this.selectedOptions.length < this.maxNumOfSelectedOptions ) {
        this.selectedOptions.push(fullKey);
        // TODO: Send selectedOptions to metrics-view
      }
      else {
        /** That is too many. Unselect element and show a snack-bar note. */
        checkbox.checked = false;
        this.snackBar.open(this.messageTooManySelections, '', { duration: 3000 });
      }
    }
    else {
      /** Option was un-selected. Search and remove its key from the selectedOptions array */
      const idx = this.selectedOptions.indexOf(fullKey);

      if (idx > -1) {
        this.selectedOptions.splice(idx, 1);
        // TODO: Send selectedOptions to metrics-view
      }
    }

  }
}
