import { Injectable } from '@angular/core';
import * as dashjs from 'dashjs';


/** Interface for metrics passed to the live chart */
export interface Metrics {
  bufferLevel?: { audio: number, video: number };
  bitrateDownload?: { audio: number, video: number };
  qualityIndex?: { audio: number, video: number };
  qualityIndexPending?: { audio: number, video: number };
  qualityIndexMax?: { audio: number, video: number };
  droppedFrames?: { audio: number, video: number };
  latency?: {
    audio: { min: number, avg: number, max: number },
    video: { min: number, avg: number, max: number }
  };
  liveLatency?: {
    audio: { min: number, avg: number, max: number }
  };
  segDownloadTime?: {
    audio: { min: number, avg: number, max: number },
    video: { min: number, avg: number, max: number }
  };
  playbackDownloadTimeRatio?: {
    audio: { min: number, avg: number, max: number },
    video: { min: number, avg: number, max: number }
  };
}

/*
export interface Metrics {
  id: number;
  name: string;
}
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

    return metrics;

  }

}
