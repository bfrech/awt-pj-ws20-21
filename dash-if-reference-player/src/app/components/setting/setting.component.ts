import {Component, OnInit} from '@angular/core';
declare const playback: any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})

export class SettingComponent implements OnInit {
  playbackSettings$: any;

  constructor() {
    this.playbackSettings$ = playback;
  }

  ngOnInit(): void {
    console.log(playback);
  }

  isBoolean(val): boolean{
    return val === false || val === true;
  }
}
