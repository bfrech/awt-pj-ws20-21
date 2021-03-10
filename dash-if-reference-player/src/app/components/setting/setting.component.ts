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
  // Intercept input property change
  @Input() set groups(groups: Array<any>) { this.setGroups(groups); }
  // tslint:disable-next-line:variable-name
  _groups: Array<any> = [];
  @Input() settingGroup: object = [];

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

  ngOnInit(): void {
    // Restructure radio button data to use [(ngModel)] in template
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

    // LOOP
    this.playerService.player.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, e => {
      if (this.loopSelected) {
        this.playerService.load();
      }
    });
  }

  /** Handle incoming groups/settings */
  setGroups(groups: Array<any>): void {
    // Add hard-coded group DRM SYSTEM
    groups.push(['DRM SYSTEM', {}]);

    if (this._groups.length < 1) {
      this._groups = groups;
    }
    else {
      const sizeOfGroups = Object.entries(groups).length;

      // Loop over new settings and apply changed entries (To avoid ugly re-rendering of the component)
      for (let i = 0; i < sizeOfGroups; i++) {
        if (JSON.stringify(this._groups[i]) !== JSON.stringify(groups[i])) {
          for (const groupKey of Object.keys(groups[i][1])) {
            if (JSON.stringify(this._groups[i][1][groupKey]) !== JSON.stringify(groups[i][1][groupKey])) {
              this._groups[i][1][groupKey] = groups[i][1][groupKey];
            }
          }
        }
      }
    }
  }

  /** Check for grouped Settings */
  isGroup(val: any): boolean {
    if (val == null || typeof val === 'string') {
      return false;
    } else {
      return (Object.values(val).length > 0);
    }
  }

  /** Check if value is of type boolean */
  isBool(value: any): boolean {
    return (typeof value === 'boolean');
  }

  /** Check if value is of type number */
  isNumber(value: any): boolean {
    return (typeof value === 'number');
  }

  /** Check if setting value is a number or a string */
  isInput(value: any): boolean {
    return (!this.isBool(value) && !this.isGroup(value) && !this.isRadio(value));
  }

  /** Check if value has constants as value */
  isRadio(value: any): boolean {
    return typeof value === 'string' && Object.keys(this.radioValues).includes(value);
  }

  /** Check if value is log level */
  isLogLevel(value: any): boolean {
    return value === 'Log Level';
  }

  /** Compare radio-constants key with setting key */
  compareRadioKey(constant: any, setting: any): boolean {
    if (typeof constant === 'string' && typeof setting === 'string') {
      const formatted = setting[0].toLowerCase() + setting.replace(/\s/g, '').slice(1);
      return formatted === constant;
    }
    return false;
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

  /** Apply changed auto-play */
  applyAutoPlay(): void {
    this.playerService.player.setAutoPlay(this.autoPlaySelected);
  }

  /** Apply changed text default setting */
  applyTextDefaultEnabled(): void {
    this.textEnabled = (this.textEnabled === undefined) ? false : this.textEnabled;
    this.playerService.player.setTextDefaultEnabled(this.textEnabled);
  }

  /** Apply forced text setting */
  applyEnableForcedTextStreaming(): void {
    this.playerService.player.enableForcedTextStreaming(this.forcedTextStreaming);
  }

  /** Add custom ABR Rules if Default Rules are enabled */
  toggleDefaultABRRules(checked: string | boolean | number): void {
    if ( !checked ) {
      // Add custom ABR Rule here
      // this.playerService.player.addABRCustomRule();
    } else {
      this.playerService.player.removeAllABRCustomRule();
    }
  }

  /** Update Settings: call dash.js updateSettings function with the path of the setting */
  update(path: string, value: string | boolean | number): void {
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
    const root: { [index: string]: string | boolean | number } = {};
    root[name] = value;

    const settingObject = parts.reduceRight((obj: any, next: any) => ({
      [next]: obj
    }), root) as dashjs.MediaPlayerSettingClass;
    this.playerService.player.updateSettings(settingObject);

    // Check if customABRRules were toggled
    if (Object.keys(root).toString() === 'useDefaultABRRules') {
      this.toggleDefaultABRRules(root.useDefaultABRRules);
    }
  }

  /** Update Log Level: switch from string to enum value */
  updateLogLevel(value: string): void {
    let level;
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

  /** Update initial media settings */
  updateMediaSettings(type: string, input: HTMLInputElement): void {
    if (type === 'audio') {
      this.playerService.player.setInitialMediaSettingsFor('audio', {
        lang: input.value
      });
    }
    if (type === 'video') {
      this.playerService.player.setInitialMediaSettingsFor('video', {
        role: input.value
      });
    }
    if (type === 'lang') {
      this.playerService.player.setInitialMediaSettingsFor('fragmentedText', {
        lang: input.value
      });
    }
    if (type === 'role') {
      this.playerService.player.setInitialMediaSettingsFor('fragmentedText', {
        role: input.value
      });
    }
  }

  /** Set Video Quality */
  selectVideoQuality(slider: MatSlider): void {
    if (slider.value) {
      this.playerService.player.setQualityFor('video', slider.value);
    }
  }

  /** Get Api description from SettingGroup */
  getApiDescription(groupName: string, setting: any): string {
    if (typeof setting !== 'string') {
      return '';
    }
    let description: object = {};
    let tooltip = '';
    Object.entries(this.settingGroup).map(([key, value]) => {
      if (key === groupName) {
        description = value;
      }
    });
    Object.entries(description).map(([key, value]) => {
      key = key.charAt(0).toUpperCase() + key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').slice(1);
      if (key === setting) {
        tooltip = value;
      }
    });
    return tooltip;
  }

  /** Keep original order */
  keepOrder = (a: any, b: any) => {
    return a;
  }

  /** Format string of radio button option */
  formatRadioOption(value: any): string {
    if (typeof value !== 'string') {
      return '';
    }
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

