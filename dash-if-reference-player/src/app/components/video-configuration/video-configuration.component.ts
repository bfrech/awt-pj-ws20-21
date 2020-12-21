import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { MatExpansionPanel } from '@angular/material/expansion';

import { PlayerService } from '../../player.service';
import * as sources from '../../../sources.json';

import {Component, OnInit} from '@angular/core';
import {PlayerService} from '../../player.service';
import {MediaPlayer} from 'dashjs';

declare const settings: any;
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
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('false <=> true', animate(120))
    ])
  ]
})


export class VideoConfigurationComponent implements OnInit {
  group$: any;
  defaultSettings: any;

  srcProvider: {[index: string]: any} = sources.provider;
  srcItems = sources.items;
  inputVarStreamAddr: string | undefined;

  streamsDropdownIsVisible = false;
  streamsDropdownExpandedPanel: MatExpansionPanel | null = null;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.inputVarStreamAddr = 'https://dash.akamaized.net/envivio/Envivio-dash2/manifest.mpd';
   // this.group$ = Object.entries(settings);
    this.group$ =  Object.entries(processSettings());



    /**
     * Settings Preprocessing: get default Settings, traverse Nested Object and return Object
     * ordered according to our custom order from groups.js
     */
    function processSettings(): object {

      // TODO: Use MediaPlayer from playerService
      const player = MediaPlayer().create();
      const defaultSettings = player.getSettings();

      // Flatten Settings Object
      const flattenedSettings = flattenSettings(defaultSettings);

      // Map Settings to custom order
      Object.values(flattenedSettings).forEach(setting => {
        setting.unshift(findGroup(setting[1]));
      });

      // Formatting
      const formatSet = Object.values(flattenedSettings).map( setting => {
        const formatted = {};
        setting[2] = setting[2].charAt(0).toUpperCase() + setting[2].replace(/([a-z0-9])([A-Z])/g, '$1 $2').slice(1);
        formatted[setting[2]] = setting[3];
        if ( setting[0] === undefined ) { setting[0] = 'OTHER'; }
        return ( [setting[0], formatted]);
      });


      // group newSet by groupNames
      const result = {};
      formatSet.forEach(setting => {
        const key = setting[0];
        if (!result[key]) {
          result[key] = Object.assign({}, setting[1]);
        } else {
          Object.assign(result[key], setting[1]);
        }
      });
      return result;
    }


    /**
     * Check if value is further nested, or if value is leaf node with key:value
     * Return false if obj is String to prevent splitting into chars
     */
    function isNested(obj): boolean {
      if (obj == null || typeof obj === 'string'){return false; }
      else { return (Object.values(obj).length > 0); }
    }

    /**
     * Traverse SettingObject until leave nodes or 3rd level, return leave nodes as Array
     */
    function flattenSettings(nestedSettings): object {
      let iteration = 0;
      const flattenedSettings = [];
      traverseObject(nestedSettings);
      function traverseObject(obj, context?: any): void {
        iteration++;
        for (const [key, value] of Object.entries(obj)){
          if ( iteration > 4 ) { flattenedSettings.push([context, key, value]); return; }
          if (!isNested(value)){
            flattenedSettings.push([context, key, value]);
          } else {
            traverseObject(value, key);
          }
        }
      }
      return flattenedSettings;
    }

    /**
     * Find group that Setting should be displayed in according to our custom order
     * defined in settingGroups.js
     */
    function findGroup(name: string): any {
      for (const key of Object.keys(settingGroups)){
        if (settingGroups[key].hasOwnProperty(name)){return key; }
      }
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

  stop(): void {
    this.playerService.stop();
  }

  load(): void {
    this.playerService.load(this.inputVarStreamAddr);
  }

  isBoolean(val): boolean {
    return val === false || val === true;
  }

  isGroup(val): boolean {
    if (val == null || typeof val === 'string'){return false; }
    else { return (Object.values(val).length > 0); }
  }

  makeArray(val): object {
    return Object.entries(val);
  }

}
