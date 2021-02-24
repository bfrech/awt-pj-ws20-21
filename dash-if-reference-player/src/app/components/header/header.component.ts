import { Component, OnInit } from '@angular/core';
import * as packageInfo from 'package.json';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  clientVersion = packageInfo.version;

  constructor() { }

  ngOnInit(): void {
  }

}
