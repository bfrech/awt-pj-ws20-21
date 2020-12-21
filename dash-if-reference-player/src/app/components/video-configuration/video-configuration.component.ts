import {Component, OnInit} from '@angular/core';
import {PlayerService} from '../../player.service';
import {MediaPlayer} from 'dashjs';

declare const settings: any;
declare const settingGroups: any;

@Component({
  selector: 'app-video-configuration',
  templateUrl: './video-configuration.component.html',
  styleUrls: ['./video-configuration.component.css']
})


export class VideoConfigurationComponent implements OnInit {
  group$: any;
  defaultSettings: any;

  // TODO: Use sources.json instead
  listOfStreams = [
    'https://dash.akamaized.net/envivio/Envivio-dash2/manifest.mpd',
    'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
    'https://media.axprod.net/TestVectors/v7-Clear/Manifest_1080p.mpd'
  ];
  inputVarStreamAddr: string | undefined;

  constructor(private playerService: PlayerService) {
  }

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
