import { Component, OnInit} from '@angular/core';
import {PlayerComponent} from './components/video-configuration/player/player.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dash-if-reference-player';
  ngOnInit(): void {
  }
}

