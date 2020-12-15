import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../player.service';
import * as sources from '../../../sources.json';
import * as $ from 'jquery';


@Component({
  selector: 'app-video-configuration',
  templateUrl: './video-configuration.component.html',
  styleUrls: ['./video-configuration.component.css']
})
export class VideoConfigurationComponent implements OnInit {

  srcProvider: {[index: string]: any} = sources.provider;
  srcItems = sources.items;
  inputVarStreamAddr: string | undefined;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.inputVarStreamAddr = this.srcItems[0].submenu[0].url;
  }

  toggleMainMenu(event: any): void {
    const menu = $(event.target).siblings('.dropdown-menu').first();

    // Reset before opening
    if (menu.is(':hidden')) {
      menu.find('.vc-collapse').css({display: 'none'});
      menu.css({width: 'auto'});
    }

    menu.fadeToggle();
  }

  toggleSubMenu(event: any): void {
    const parentMenu = $(event.target).parents('ul.dropdown-menu');

    // Enlarge dropdown menu (if not already done) and toggle sub-menu collapse
    parentMenu.animate({width: '100%'}, 500);
    $(event.target).siblings().slideToggle();

    // If another sub-menu is still open, close it
    $(event.target).parent('.vc-dropdown-submenu').siblings().children('.vc-collapse:visible')
      .slideUp();

  }

  selectStream(event: any, url: string): void {
    this.inputVarStreamAddr = url;
    $(event.target).parents('.dropdown-menu').first().fadeOut();
  }

  stop(): void {
    this.playerService.stop();
  }

  load(): void {
    this.playerService.load(this.inputVarStreamAddr);
  }
}
