import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PlayerService} from '../../services/player.service';
import * as dashjs from 'dashjs';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class SettingComponent implements OnInit {
  @Input() groups: any;
  @Input() settingGroup: any;
  description: any;
  descriptionLevelDown: any;
  tooltip: any;
  checked = false;
  closeResult = '';
  settings: string[] = [];
  logLevels = [
    ['NONE', false],
    ['FATAL', false],
    ['ERROR', false],
    ['WARNING', true],
    ['INFO', false],
    ['DEBUG', false]
  ];

  movingAverageMethods = [
    ['Sliding Window', true],
    ['EWMA', false]
  ];

  abrStrategy = [
    ['Dynamic', true],
    ['BOLA', false]
  ];

  // playerService must be public to access it in the template
  constructor(public playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.groups.forEach((group: any) => {
      this.settings.push(group[0]);
    });

    console.log(this.settingGroup);
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

  /**
   * Update Settings: call dash.js updateSettings function with the path of the setting
   */
  update(path: string, value: any): void {
    // Build Object from path to pass to updateSettings function
    const parts = path.split('.');

    // TODO:
    // const name = parts.pop()?.toString();

    // @ts-ignore
    const name = parts.pop().toString();
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

  updateABRStrategy(value: any): void {
    const strategy = (value === 'BOLA') ? 'abrBola' : 'abrDynamic';
    this.playerService.player.updateSettings({
      streaming: {
        abr: {
          ABRStrategy: strategy
        },
        liveCatchup: {}
      }
    });
  }

  updateMovingAverageMethod(value: any): void {
    const strategy = (value === 'EWMA') ? 'ewma' : 'slidingWindow';
    this.playerService.player.updateSettings({
      streaming: {
        abr: {
          movingAverageMethod: strategy
        },
        liveCatchup: {}
      }
    });
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

}

