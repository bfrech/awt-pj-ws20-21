import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import {MatExpansionPanel} from '@angular/material/expansion';

import {PlayerService} from '../../player.service';
import * as sources from '../../../sources.json';
import {MediaPlayer} from 'dashjs';

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
      state('true', style({opacity: 1})),
      state('false', style({opacity: 0})),
      transition('false <=> true', animate(120))
    ])
  ]
})


export class VideoConfigurationComponent implements OnInit {
  group$: any;
  defaultSettings: any;

  srcProvider: { [index: string]: any } = sources.provider;
  srcItems = sources.items;
  inputVarStreamAddr: string | undefined;

  streamsDropdownIsVisible = false;
  streamsDropdownExpandedPanel: MatExpansionPanel | null = null;

  constructor(private playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.inputVarStreamAddr = 'https://dash.akamaized.net/envivio/Envivio-dash2/manifest.mpd';
    this.group$ = Object.entries(processSettings());

    /**
     * Settings Preprocessing: get default Settings, traverse Nested Object and return Object
     * ordered according to our custom order from groups.js
     */
    function processSettings(): object {

      // TODO: Use MediaPlayer from playerService
      const player = MediaPlayer().create();
      const defaultSettings = player.getSettings();

      const flattenedSettings = [];
      Object.entries(flattenObject(defaultSettings)).map(setting => {
        flattenedSettings.push([setting[0].split('.').slice(-2, -1).toString(), setting[0].split('.').slice(-1).toString(), setting[1]]);
      });

      // Find Related settings and group the settings
      const res = [];
      flattenedSettings.forEach(setting => {
        if (!(setting[0] === 'debug' || setting[0] === 'streaming' || setting[0] === 'abr' || setting[0] === 'abr' ||
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
        withGroups.push([findGroup(setting[0]), setting[0], setting[1]]);
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
     * Traverse Object until leaf node
     */
    function flattenObject(obj): object {
      const result = {};
      for (const i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue;
        }
        if (obj[i] === null) {
          obj[i] = 'null';
        }
        if ((typeof obj[i]) === 'object') {
          const flatObject = flattenObject(obj[i]);
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
    function findGroup(name: string): any {
      for (const key of Object.keys(settingGroups)) {
        if (settingGroups[key].hasOwnProperty(name)) {
          return key;
        }
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
    if (val == null || typeof val === 'string') {
      return false;
    } else {
      return (Object.values(val).length > 0);
    }
  }

  makeArray(val): object {
    return Object.entries(val);
  }

  getKey(val): string[] {
    return Object.keys(val);
  }

  getValue(val): any {
    return Object.values(val)[0];
  }
}
