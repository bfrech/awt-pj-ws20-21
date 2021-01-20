import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import * as dashjs from 'dashjs/index';


import {
  trigger,
  state,
  style,
  animate,
  transition
  // ...
} from '@angular/animations';
import {MatExpansionPanel} from '@angular/material/expansion';

import {PlayerService} from '../../player.service';
import * as sources from '../../../sources.json';
import {PlayerComponent} from './player/player.component';

declare const settingGroups: any;

@Component({
  selector: 'app-video-configuration',
  templateUrl: './video-configuration.component.html',
  styleUrls: ['./video-configuration.component.css'],
  /**
   * Need to remove view encapsulation so that dynamic mat elements can be styled. Otherwise, style definitions would
   * have to be defined in global styles.css or deprecated selector ::ng-deep would have to be used.
   */
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('streamsDropdownShowHide', [
      state('true', style({
        // scaleY(0) <=> scaleY(1) is not animated but set as state to prevent user-interaction with hidden element
        transform: 'scaleY(1)',
        opacity: 1
      })),
      state('false', style({
        transform: 'scaleY(0)',
        opacity: 0
      })),
      transition('false => true', [
        // Set scaleY(1) initially, then start animation
        style({transform: 'scaleY(1)', opacity: 0}),
        animate(100, style({opacity: 1}))
      ]),
      transition('true => false',
        animate(100, style({opacity: 0}))
        // After the animation, scaleY(0) is set automatically by state declaration
      )
    ]),
    trigger('settingsShowHide', [
      state('true', style({
        // scaleY(0) <=> scaleY(1) is not animated but set as state to prevent user-interaction with hidden element
        transform: 'scaleY(1)',
        height: '*'
      })),
      state('false', style({
        transform: 'scaleY(0)',
        height: '0px'
      })),
      transition('false => true', [
        // Set scaleY(1) initially, then start animation
        style({transform: 'scaleY(1)', height: '0px'}),
        animate(500, style({height: '*'}))
      ]),
      transition('true => false',
        animate(500, style({height: '0px'}))
        // After the animation, scaleY(0) is set automatically by state declaration
      )
    ]),
  ]
})


export class VideoConfigurationComponent implements OnInit, AfterViewInit {
  defaultSettings: any;
  groups: any;
  srcProvider: { [index: string]: any } = sources.provider;
  srcItems = sources.items;
  inputVarStreamAddr: string | undefined;

  streamsDropdownIsVisible = false;
  streamsDropdownExpandedPanel: MatExpansionPanel | null = null;

  settingsSectionIsVisible = false;
  enumValues: Array<string> = [];
  @ViewChild(PlayerComponent) player;

  constructor(private playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.inputVarStreamAddr = 'https://dash.akamaized.net/envivio/Envivio-dash2/manifest.mpd';
  }

  ngAfterViewInit(): void {
    this.defaultSettings = this.player.getSettings();
    //this.processSettings();
    this.buildSettings();
    console.log(dashjs.MediaPlayerSettingClass.name);
  }
  ////////////////////////////////////////
  // Player Setup
  ////////////////////////////////////////
  /**
   * Settings Preprocessing: get default Settings, traverse Nested Object and return Object
   * ordered according to our custom order from groups.js
   */

  processSettings(): object {
    const flattenedSettings = [];
    Object.entries(this.flattenObject(this.defaultSettings)).map(setting => {
      flattenedSettings.push([setting[0].split('.').slice(-2, -1).toString(), setting[0].split('.').slice(-1).toString(), setting[1]]);
    });

    // Find Related settings and group the settings
    const res = [];
    flattenedSettings.forEach(setting => {
      if (!(setting[0] === 'debug' || setting[0] === 'streaming' || setting[0] === 'abr' ||
        setting[0] === 'cmcd')) {
        if (!res[setting[0]]) {
          res[setting[0]] = [];
        }
        const formatted = {};
        formatted[setting[1]] = setting[2];
        res[setting[0]].push(formatted);
      } else {
        res[setting[1]] = setting[2];
      }
    });

    // Map to custom groups
    const withGroups = [];
    Object.entries(res).forEach(setting => {
      withGroups.push([this.findGroup(setting[0]), setting[0], setting[1]]);
    });

    // Formatting
    const formatSet = Object.values(withGroups).map(setting => {
      setting[1] = setting[1].charAt(0).toUpperCase() + setting[1].replace(/([a-z0-9])([A-Z])/g, '$1 $2').slice(1);
      if (setting[0] === undefined) {
        setting[0] = 'OTHER';
      }
      const formatted = {};
      formatted[setting[1]] = setting[2];
      return ([setting[0], formatted]);
    });

    // Grouping
    const resultNew = {};
    formatSet.forEach(setting => {
      const key = setting[0];
      if (!resultNew[key]) {
        resultNew[key] = Object.assign({}, setting[1]);
      } else {
        Object.assign(resultNew[key], setting[1]);
      }
    });
    return resultNew;
  }

  /**
   * Build HTML Elements for each Setting
   */
  buildSettings(): void {
    this.groups.forEach(grp => {
      // .setting-frame
      const element = document.createElement('div');
      element.setAttribute('class', 'settings-frame col-3');

      // .content
      const contentElement = document.createElement('div');
      contentElement.setAttribute('class', 'content');
      element.appendChild(contentElement);
      const header = document.createElement('h4');
      header.textContent = grp[0];
      contentElement.appendChild(header);

      // .singleSetting
      Object.entries(grp[1]).forEach(setting => {

        // Name
        const name = setting[0];
        const singleSetting = document.createElement('div');
        const settingName = document.createElement('p');
        singleSetting.setAttribute('class', 'singleSetting my-3');
        settingName.textContent = name + ': ';
        singleSetting.appendChild(settingName);

        // Input Name
        const value = setting[1];
        const input = document.createElement('div');
        input.setAttribute('class', 'input');

        // Debug
        if (grp[0] === 'DEBUG') {
          const logLevelDebug = document.createElement('input');
          logLevelDebug.setAttribute('type', 'radio');
          logLevelDebug.setAttribute('id', 'debug');
          logLevelDebug.setAttribute('name', 'loglevel');
          logLevelDebug.setAttribute('value', 'DEBUG');
          const logLevelDebugLabel = document.createElement('label');
          logLevelDebugLabel.setAttribute('for', 'debug');
          logLevelDebugLabel.setAttribute('value', 'DEBUG');
          input.appendChild(logLevelDebug);
          input.appendChild(logLevelDebugLabel);
        }
        // TODO: Radio Buttons

        // Checkbox
        if (typeof value === 'boolean') {
          const checkbox = document.createElement('input');
          checkbox.setAttribute('color', 'primary');
          checkbox.setAttribute('type', 'checkbox');
          input.appendChild(checkbox);
        }
        // Grouped Settings
        else if (this.isGroup(value)) {
          const groupedSetting = document.createElement('div');
          groupedSetting.setAttribute('class', 'SingleSubSetting ml-3');
          Object.values(value).forEach((subSetting) => {
            const subName = document.createElement('p');
            subName.textContent = Object.keys(subSetting).toString() + ': ';
            groupedSetting.appendChild(subName);

            const inputField = document.createElement('input');
            const subvalue = Object.values(subSetting)[0];
            if (typeof subvalue === 'boolean') {
              inputField.setAttribute('color', 'primary');
              inputField.setAttribute('type', 'checkbox');
              groupedSetting.appendChild(inputField);
            } else {
              inputField.setAttribute('value', subvalue.toString());
              groupedSetting.appendChild(inputField);
            }
            input.appendChild(groupedSetting);
          });
        } else {
          // Text Input
          const inputField = document.createElement('input');
          inputField.setAttribute('value', value.toString());
          input.appendChild(inputField);
        }
        singleSetting.appendChild(input);
        contentElement.appendChild(singleSetting);
      });
      document.getElementById('settingMenu').appendChild(element);
    });
  }

  ////////////////////////////////////////
  // Player Methods
  ////////////////////////////////////////
  updateSettings(): void {
  }

  ////////////////////////////////////////
  // Helper Functions
  ////////////////////////////////////////
  /**
   * Traverse Object until leaf node
   */
  flattenObject(obj): object {
    const result = {};
    for (const i in obj) {
      if (!obj.hasOwnProperty(i)) {
        continue;
      }
      if (obj[i] === null) {
        obj[i] = 'null';
      }
      if ((typeof obj[i]) === 'object') {
        const flatObject = this.flattenObject(obj[i]);
        for (const x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) {
            continue;
          }
          result[i + '.' + x] = flatObject[x];
        }
      } else {
        result[i] = obj[i];
      }
    }
    return result;
  }

  /**
   * Find group that Setting should be displayed in according to our custom order
   * defined in settingGroups.js
   */
  findGroup(name: string): any {
    for (const key of Object.keys(settingGroups)) {
      if (settingGroups[key].hasOwnProperty(name)) {
        return key;
      }
    }
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

  setStreamsDropdownExpandedPanel(panel: MatExpansionPanel): void {
    this.streamsDropdownExpandedPanel = panel;
  }

  streamsDropdownToggle(): void {
    this.streamsDropdownIsVisible = !this.streamsDropdownIsVisible;
    if (!this.streamsDropdownIsVisible) {
      this.streamsDropdownExpandedPanel?.close();
      this.streamsDropdownExpandedPanel = null;
    }
  }

  selectStream(url: string): void {
    this.inputVarStreamAddr = url;
    this.streamsDropdownToggle();
  }

  settingsSectionToggle(): void {
    this.settingsSectionIsVisible = !this.settingsSectionIsVisible;
  }

  stop(): void {
    this.playerService.stop();
  }

  load(): void {
    this.playerService.load(this.inputVarStreamAddr);
  }

}
