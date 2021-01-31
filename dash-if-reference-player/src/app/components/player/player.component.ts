import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { PlayerService } from '../../services/player.service';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements AfterViewInit {

  // Get <video> element reference
  @ViewChild('videoPlayer', {read: ElementRef}) videoElement!: ElementRef<HTMLElement>;

  constructor(private playerService: PlayerService) { }

  ngAfterViewInit(): void {
    // When <video> element ref is available, initialize dashjs player via playerService
    this.playerService.player.initialize(this.videoElement.nativeElement);
  }

}
