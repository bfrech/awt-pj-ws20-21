import { Injectable } from '@angular/core';
import * as dashjs from 'dashjs';
import { Metrics } from './metrics';

/**
 * This service provides a dashjs object and some helper methods that can be accessed from every component where needed
 */


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  // tslint:disable-next-line:variable-name
  private readonly _player: dashjs.MediaPlayerClass;

  constructor() {
    this._player = dashjs.MediaPlayer().create();
  }

  /** Getter for dashjs player object */
  get player(): dashjs.MediaPlayerClass {
    return this._player;
  }

  /** Stop player by unloading source */
  stop(): void {
    this._player.attachSource('');
  }

  /** Load source */
  load(streamAddr: string | undefined): void {
    this._player.attachSource(streamAddr);
  }

  /** Provide metrics to be displayed in live chart */
  getMetrics(): Metrics {

    const dashMetrics: dashjs.DashMetrics = this._player.getDashMetrics();
    // const dashAdapter: dashjs.DashAdapter = this._player.getDashAdapter();
    const metrics: Metrics = {};

    metrics.bufferLevel = {
      audio: dashMetrics.getCurrentBufferLevel('audio'),
      video: dashMetrics.getCurrentBufferLevel('video')
    };

    // TODO: more metrics..

    return metrics;

  }

}
