import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {MediaPlayer} from 'dashjs';

import {PlayerService} from '../../../player.service';
import * as sources from '../../../../sources.json';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent implements OnInit{
  // srcProvider = sources.provider;
  srcItems = sources.items;
  streamAddr = this.srcItems[0].submenu[0].url;
  player = MediaPlayer().create();

  constructor(private playerService: PlayerService) {

    this.playerService.playerStopCalled$.subscribe(
      () => {
        this.stop();
      }
    );

    this.playerService.playerLoadCalled$.subscribe(
      streamAddr => {
        this.streamAddr = streamAddr;
        this.load();
      });

  }

  ngOnInit(): void {
    const videoElement = document.getElementById('videoPlayer');

    if (videoElement) {
      this.player.initialize(videoElement, this.streamAddr, false);
    }
  }

  // tslint:disable-next-line:typedef


  stop(): void {
    this.player.attachSource('');
  }

  load(): void {
    this.player.attachSource(this.streamAddr);
  }

  getSettings(): any {
    return this.player.getSettings();
  }

}
