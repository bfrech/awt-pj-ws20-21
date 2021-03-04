import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSlider } from '@angular/material/slider';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NgxMasonryComponent } from 'ngx-masonry';
import { PlayerService } from '../../services/player.service';
import * as dashjs from 'dashjs';
import { constants } from 'src/assets/constants';


@Component({
  selector: 'app-drm-dialog',
  templateUrl: './drm-dialog.html',
  styleUrls: ['./drm-dialog.css'],
})
export class DrmDialogComponent {
  isValidJSON = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}

  checkSyntax(): void {
    this.isValidJSON = true;
    try {
      JSON.parse(this.data);
    } catch (e) {
      this.isValidJSON = false;
    }
  }
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class SettingComponent implements OnInit {
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;
  @Input() groups: any;
  @Input() settingGroup: any;
  description: any;
  tooltip: any;
  checked = false;
  closeResult = '';
  radioValues = constants;
  loopSelected = true;
  autoPlaySelected = true;
  drmSelected = false;

  ngRadioBoxes: { [index: string]: string } = {};

  // INITIAL TEXT SETTINGS
  textEnabled = this.playerService.player.getTextDefaultEnabled();
  forcedTextStreaming = this.playerService.player.isTextEnabled();


  constructor(public playerService: PlayerService, public dialog: MatDialog) {
    this.playerService.updateProtectionDataCalled$.subscribe(
      protectionData => {
        this.drmSelected = (Object.entries(protectionData).length > 0);
      });
  }

  print(): void {
    console.log(this.ngRadioBoxes);
  }
  ngOnInit(): void {
    // Build array with radio button data (To be able to manipulate them later)
    for (const [radioGroupKey, radioGroupValue] of Object.entries(constants)) {
      for (const [radioOptionKey, radioOptionValue] of Object.entries(radioGroupValue)) {
        if (this.isGroup(radioOptionValue)) {
          // If entry is a group itself, loop over entries and apply if an entries value is true
          for (const [radioSubKey, radioSubValue] of Object.entries(radioOptionValue)) {
            if (radioSubValue === true) {
              const key = `${radioGroupKey}.${radioOptionKey}`;
              this.ngRadioBoxes[key] = radioSubKey;
            }
          }
        }
        else if (radioOptionValue === true) {
          // If entry is no group and true, apply it as selected
          this.ngRadioBoxes[radioGroupKey] = radioOptionKey;
        }
      }
    }

    // Add hard-coded group DRM SYSTEM
    this.groups.push(['DRM SYSTEM', {}]);

    // LOOP
    this.playerService.player.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, e => {
      if (this.loopSelected) {
        this.playerService.load();
      }
    });
  }

  /**
   *  Auto-Play
   */
  toggleAutoPlay(value: boolean): void {
    this.playerService.player.setAutoPlay(value);
    this.autoPlaySelected = value;
  }

  /**
   * Loop
   */
  toggleLoop(value: boolean): void {
    this.loopSelected = value;
  }

  /** If drm has been turned off, remove protection data and do a reload. */
  drmToggle(element: MatSlideToggle): void {
    if (!element.checked) {
      this.playerService.setProtectionData({});
      this.playerService.load();
    }
  }

  /** Open Dialog for DRM JSON input and fetch input data */
  openDrmDialog(): void {
    const protectionDataJSON = JSON.stringify(this.playerService.protectionData, undefined, 4);

    const dialogRef = this.dialog.open(DrmDialogComponent, {
      data: protectionDataJSON,
      panelClass: 'overlayLarge'
    });

    dialogRef.afterClosed().subscribe(data => {
      this.applyCustomProtection(data);
    });
  }

  /** Apply DRM JSON input */
  applyCustomProtection(data: string): void {
    if (data.length > 0) {
      let parsedData: object | null = null;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        console.log(e);
      }
      if (parsedData) {
        this.playerService.setProtectionData(parsedData);
        this.playerService.load();
      }
    }
  }

  /**
   * Check for grouped Settings
   */
  isGroup(val: any): boolean {
    if (val == null || typeof val === 'string') {
      return false;
    } else {
      return (Object.values(val).length > 0);
    }
  }

  /**
   * Check if setting value is a boolean
   */
  isBoo(value: any): boolean {
    this.checked = value;
    return (typeof value === 'boolean');
  }

  /**
   * Check if setting value is a number or a string
   */
  isInput(value: any): boolean {
    return (!this.isBoo(value) && !this.isGroup(value) && !this.isRadio(value));
  }

  /**
   * Check if value has constants as value
   */
  isRadio(value: any): boolean {
    return (typeof value === 'string' && value !== 'null');
  }

  isLogLevel(value: any): boolean {
    return value === 'Log Level';
  }

  compare(constant: any, setting: any): boolean {
    const formatted = setting[0].toLowerCase() + setting.replace(/\s/g, '').slice(1);
    return formatted === constant;
  }

  /**
   * Update Settings: call dash.js updateSettings function with the path of the setting
   */

  update(path: string, value: any): void {
    // If abrLoLP was selected, change additional options and also apply them to the template
    if (value === 'abrLoLP') {
      this.update('streaming.abr.fetchThroughputCalculationMode', 'abrFetchThroughputCalculationMoofParsing');
      this.update('streaming.liveCatchup.mode', 'liveCatchupModeLoLP');
      this.ngRadioBoxes['fetchThroughputCalculationMode' as const] = 'abrFetchThroughputCalculationMoofParsing';
      this.ngRadioBoxes['liveCatchup.mode' as const] = 'liveCatchupModeLoLP';
    }

    // Build Object from path to pass to updateSettings function
    const parts = path.split('.');
    const name = parts.pop()?.toString() ?? undefined;

    if (name === undefined) {
      return;
    }
    const root: { [index: string]: any } = {};
    root[name] = value;
    const settingObject = parts.reduceRight((obj: any, next: any) => ({
      [next]: obj
    }), root);
    this.playerService.player.updateSettings(settingObject);
  }

  updateLogLevel(value: any): void {
    let level: any;
    switch (value) {
      case 'NONE':
        level = dashjs.LogLevel.LOG_LEVEL_NONE;
        break;
      case 'FATAL':
        level = dashjs.LogLevel.LOG_LEVEL_FATAL;
        break;
      case 'ERROR':
        level = dashjs.LogLevel.LOG_LEVEL_ERROR;
        break;
      case 'WARNING':
        level = dashjs.LogLevel.LOG_LEVEL_WARNING;
        break;
      case 'INFO':
        level = dashjs.LogLevel.LOG_LEVEL_INFO;
        break;
      case 'DEBUG':
        level = dashjs.LogLevel.LOG_LEVEL_DEBUG;
        break;
      default:
        level = dashjs.LogLevel.LOG_LEVEL_WARNING;
    }
    this.playerService.player.updateSettings({
      debug: {logLevel: level}
    });
  }

  updateTextDefaultEnabled(checked: boolean): void {
    this.playerService.player.setTextDefaultEnabled(checked);
    this.textEnabled = checked;
  }


  updateEnableForcedTextStreaming(checked: boolean): void {
    this.playerService.player.enableForcedTextStreaming(checked);
    this.forcedTextStreaming = checked;
  }

  updateMediaSettings(type: string, event: any): void {
    if (type === 'audio') {
      this.playerService.player.setInitialMediaSettingsFor('audio', {
        lang: event.target.value
      });
    }
    if (type === 'video') {
      this.playerService.player.setInitialMediaSettingsFor('video', {
        role: event.target.value
      });
    }
    if (type === 'lang') {
      this.playerService.player.setInitialMediaSettingsFor('fragmentedText', {
        lang: event.target.value
      });
    }
    if (type === 'role') {
      this.playerService.player.setInitialMediaSettingsFor('fragmentedText', {
        role: event.target.value
      });
    }
  }

  /** Set Video Quality */
  selectVideoQuality(slider: MatSlider): void {
    if (slider.value) {
      this.playerService.player.setQualityFor('video', slider.value);
    }
  }

  /**
   * Get Api description from SettingGroup
   */
  getApiDescription(groupName: string, setting: any): string {
    Object.entries(this.settingGroup).map(([key, value]) => {
      if (key === groupName) {
        this.description = value;
      }
    });
    Object.entries(this.description).map(([key, value]) => {
      key = key.charAt(0).toUpperCase() + key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').slice(1);
      if (key === setting) {
        this.tooltip = value;
      }
    });
    return this.tooltip;
  }

  /**
   * Keep original order
   */
  keepOrder = (a: any, b: any) => {
    return a;
  }

  format(value: any): string {
    const length = value.split(/(?=[A-Z])/).length;
    // Only format long values that do not fit
    if (length > 4) {
      return value.split(/(?=[A-Z])/)[length - 2] + value.split(/(?=[A-Z])/)[length - 1];
    } else {
      return value;
    }
  }

  /** Trigger re-arrangement of masonry items */
  updateMasonry(): void {
    this.masonry.layout();
  }
}

