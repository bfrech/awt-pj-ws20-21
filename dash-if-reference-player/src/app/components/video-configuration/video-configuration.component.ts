import {Component, OnInit, ViewEncapsulation} from '@angular/core';
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
import * as sources from '../../../assets/sources.json';
import {MediaPlayer, MediaPlayerSettingClass} from 'dashjs';
import * as dashjs from 'dashjs';

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
        /** scaleY(0) <=> scaleY(1) is not animated but set as state to prevent user-interaction with hidden element */
        transform: 'scaleY(1)',
        opacity: 1
      })),
      state('false', style({
        transform: 'scaleY(0)',
        opacity: 0
      })),
      transition('false => true', [
        /**  Set scaleY(1) initially, then start animation */
        style({ transform: 'scaleY(1)', opacity: 0 }),
        animate(100, style({ opacity: 1 }))
      ]),
      transition('true => false',
        animate(100, style({opacity: 0}))
        // After the animation, scaleY(0) is set automatically by state declaration
      )
    ]),
    trigger('settingsShowHide', [
      state('true', style({
        /** scaleY(0) <=> scaleY(1) is not animated but set as state to prevent user-interaction with hidden element */
        transform: 'scaleY(1)',
        height: '*'
      })),
      state('false', style({
        transform: 'scaleY(0)',
        height: '0px'
      })),
      transition('false => true', [
        /**  Set scaleY(1) initially, then start animation */
        style({ transform: 'scaleY(1)', height: '0px' }),
        animate(500, style({ height: '*' }))
      ]),
      transition('true => false',
        animate(500, style({ height: '0px' }))
        /** After the animation, scaleY(0) is set automatically by state declaration */
      )
    ]),
  ]
})


export class VideoConfigurationComponent implements OnInit {
  groups: any;
  defaultSettings: any;

  srcProvider: { [index: string]: any } = sources.provider;
  srcItems = sources.items;
  inputVarStreamAddr = this.srcItems[0].submenu[4].url;

  streamsDropdownIsVisible = false;
  streamsDropdownExpandedPanel: MatExpansionPanel | null = null;

  settingsSectionIsVisible = false;

  /** playerService must be public to access it in the template */
  constructor(public playerService: PlayerService) { }

  ngOnInit(): void {
    this.inputVarStreamAddr = 'https://dash.akamaized.net/envivio/Envivio-dash2/manifest.mpd';
    this.groups = Object.entries(this.processSettings());
    console.log(this.groups);
  }

  ////////////////////////////////////////
  // Player Setup
  ////////////////////////////////////////
  /**
   * Settings Preprocessing: get default Settings, traverse Nested Object and return Object
   * ordered according to our custom order from groups.js
   */

  processSettings(): object {
    // TODO: Use MediaPlayer from playerService
    const player = MediaPlayer().create();
    const defaultSettings = player.getSettings();

    const flattenedSettings = [];
    Object.entries(this.flattenObject(defaultSettings)).map(setting => {
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


  /** Assign object of the dropdown accordion to make it accessible for manipulation */
  setStreamsDropdownExpandedPanel(panel: MatExpansionPanel): void {
    this.streamsDropdownExpandedPanel = panel;
  }

  /** Toggle visibility of dropdown menu. If it gets hidden, close the accordion */
  streamsDropdownToggle(): void {
    this.streamsDropdownIsVisible = !this.streamsDropdownIsVisible;
    if (!this.streamsDropdownIsVisible) {
      this.streamsDropdownExpandedPanel?.close();
      this.streamsDropdownExpandedPanel = null;
    }
  }

  /** When a stream is selected, apply URL and toggle dropdown menu */
  selectStream(url: string): void {
    this.inputVarStreamAddr = url;
    this.streamsDropdownToggle();
  }

  /** Toggle visibility of settings section. */
  settingsSectionToggle(): void {
    this.settingsSectionIsVisible = !this.settingsSectionIsVisible;
  }

}
