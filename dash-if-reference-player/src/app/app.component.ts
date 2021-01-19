import {Component, Input, OnInit} from '@angular/core';
import { MediaPlayerSettingClass } from 'dashjs/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @Input() test: MediaPlayerSettingClass;
  title = 'dash-if-reference-player';

  ngOnInit(): void {

  }
}

