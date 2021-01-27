import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import * as dashjs from 'dashjs';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})

export class SettingComponent implements OnInit {
  @Input() groups;
  checked = false;

  enums = {
    logLevels:  ['DEBUG', 'ERROR', 'FATAL', 'INFO', 'NONE', 'WARNING'],
    movingAverageMethod: ['Sliding Window', 'EWMA'],
    ABRStrategy: ['Dynamic', 'BOLA']
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Check for grouped Settings
   */
  isGroup(val): boolean {
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
    if (value === 'ABRStrategy' || value === 'Log Level' || value === 'Moving Average Method'){
      return true;
    } else {
      return false;
    }
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

  // TODO description
  updateSettings(): void {
  }
}
