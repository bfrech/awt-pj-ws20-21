import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatSlider} from '@angular/material/slider';
import {NgxMasonryComponent} from 'ngx-masonry';
import {PlayerService} from '../../services/player.service';
import * as dashjs from 'dashjs';
import {constants, drmKeySystems} from 'src/assets/constants';


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
  settings: string[] = [];
  constants = constants;
  loopSelected = true;
  autoPlaySelected = true;

  // DRM KEY SYSTEM
  drmSelected = false;
  drmKeySystems = drmKeySystems;
  selectedDRMKeySystem = '';
  drmLicenseUrl = '';

 // INITIAL TEXT SETTINGS
  textEnabled = this.playerService.player.getTextDefaultEnabled();
  forcedTextStreaming = this.playerService.player.isTextEnabled();


  // playerService must be public to access it in the template
  constructor(public playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.groups.forEach((group: any) => {
      this.settings.push(group[0]);
    });
    this.groups.push(['DRM SYSTEM', {}]);

    // LOOP
    this.playerService.player.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, e => {
      if (this.loopSelected) {
        this.playerService.load(this.playerService.streamAddress);
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

  /**
   * DRM Protection Settings
   */
  toggleDRM(value: boolean): void {
    this.drmSelected = value;
  }

  changeDRMKeySystem(value: any): void {
    this.selectedDRMKeySystem = value;
    this.setProtection();
  }

  setLicenseURL(value: string): void {
    this.drmLicenseUrl = value;
    this.setProtection();
  }

  setProtection(): void {
    let protData: { [index: string]: any } = {};
    if (this.playerService.streamItem.hasOwnProperty('protData')) {
      protData = this.playerService.streamItem.protData;
    } else if (this.drmLicenseUrl !== '' && this.selectedDRMKeySystem !== '') {
      protData[this.selectedDRMKeySystem] = {
        serverURL: this.drmLicenseUrl
      };
    }
    this.playerService.player.setProtectionData(protData);
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
    // Build Object from path to pass to updateSettings function
    const parts = path.split('.');
    const name = parts.pop()?.toString();
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

