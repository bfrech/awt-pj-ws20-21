import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class SettingComponent implements OnInit {
  @Input() groups;
  checked = false;
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

  isRadio(value: any): boolean {
    return (!this.isBoo(value));
  }

  // TODO description
  updateSettings(): void {
  }
}