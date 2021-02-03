import {Component, Input, OnInit} from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})

export class SettingComponent implements OnInit {
  @Input() groups: any;
  checked = false;

  enums = {
    logLevels:  ['DEBUG', 'ERROR', 'FATAL', 'INFO', 'NONE', 'WARNING'],
    movingAverageMethod: ['Sliding Window', 'EWMA'],
    ABRStrategy: ['Dynamic', 'BOLA']
  };

  // playerService must be public to access it in the template
  constructor(public playerService: PlayerService) { }

  ngOnInit(): void {
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
    return (!this.isBoo(value));
  }

  /**
   * Check if value has constants as value
   */
  isRadio(value: any): boolean {
    return value === 'ABRStrategy' || value === 'Log Level' || value === 'Moving Average Method';
  }

  isLogLevel(value: any): boolean {
    return value === 'Log Level';
  }

  isABRStrategy(value: any): boolean {
    return value === 'ABRStrategy';
  }

  isMovingAverageMethod(value: any): boolean {
    return value === 'Moving Average Method';
  }

  /**
   * Update Settings: call dash.js updateSettings function with the path of the setting
   */
  update(path: string, value: any): void {
    // Build Object from path to pass to updateSettings function
    const parts = path.split('.');
    // @ts-ignore
    const name = parts.pop().toString();
    const root: {[index: string]: any} = {};
    root[name] = value;
    const settingObject = parts.reduceRight((obj: any, next: any ) => ({
       [next]: obj
    }), root);
    this.playerService.player.updateSettings(settingObject);
    console.log( this.playerService.player.getSettings());
  }
}
