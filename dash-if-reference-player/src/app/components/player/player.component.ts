import { Component, OnInit } from '@angular/core';
import { MediaPlayer } from 'dashjs';

import { PlayerService } from '../../player.service';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  // Default still hardcoded, see also video-configuration.component.ts
  streamAddr = 'https://dash.akamaized.net/envivio/Envivio-dash2/manifest.mpd';
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

    const videoElement = document.getElementById('videoPlayer');       // Better way to bind HTMLElement?

    if (videoElement) {                                                         // Make sure it is not null
      this.player.initialize(videoElement, this.streamAddr, false);
    }

  }

  stop(): void {
    this.player.attachSource('');
  }

  load(): void {
    this.player.attachSource(this.streamAddr);
  }

}
