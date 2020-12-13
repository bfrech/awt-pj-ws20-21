import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../player.service';
import * as sources from '../../../sources.json';



@Component({
  selector: 'app-video-configuration',
  templateUrl: './video-configuration.component.html',
  styleUrls: ['./video-configuration.component.css']
})
export class VideoConfigurationComponent implements OnInit {

  srcProvider = sources.provider;
  srcItems = sources.items;
  inputVarStreamAddr: string | undefined;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.inputVarStreamAddr = this.srcItems[0].submenu[0].url;
  }

  stop(): void {
    this.playerService.stop();
  }

  load(): void {
    this.playerService.load(this.inputVarStreamAddr);
  }
}
