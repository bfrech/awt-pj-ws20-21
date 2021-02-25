import { Component, OnInit } from '@angular/core';
import * as dashjsPackageInfo from 'dashjs/package.json';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  clientVersion = dashjsPackageInfo.version;

  constructor() { }

  ngOnInit(): void {
  }

}
