import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../player.service';

@Component({
  selector: 'app-video-configuration',
  templateUrl: './video-configuration.component.html',
  styleUrls: ['./video-configuration.component.css']
})
export class VideoConfigurationComponent implements OnInit {

  // TODO: Use sources.json instead
  listOfStreams = [
    'https://dash.akamaized.net/envivio/Envivio-dash2/manifest.mpd',
    'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
    'https://media.axprod.net/TestVectors/v7-Clear/Manifest_1080p.mpd'
  ];
  inputVarStreamAddr: string | undefined;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.inputVarStreamAddr = 'https://dash.akamaized.net/envivio/Envivio-dash2/manifest.mpd';
  }

  stop(): void {
    this.playerService.stop();
  }

  load(): void {
    this.playerService.load(this.inputVarStreamAddr);
  }
}
