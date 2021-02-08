import { Injectable } from '@angular/core';
import * as dashjs from 'dashjs';
import '../types/dashjs-types';
import { hasOwnProperty } from '../../assets/hasownproperty';
import { Metrics } from '../metrics';


/*
 * This service provides a dashjs player object and some helper methods that can be accessed from every component where
 * needed
 */

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  // tslint:disable-next-line:variable-name
  private readonly _player: dashjs.MediaPlayerClass;
  private streamInfo: dashjs.StreamInfo | null | undefined;
  private pendingIndex = { audio: NaN, video: NaN };

  constructor() {

    // Create player instance and setup listeners for player events
    this._player = dashjs.MediaPlayer().create();
    this._player.on(dashjs.MediaPlayer.events.PERIOD_SWITCH_COMPLETED, (e) => {
      this.streamInfo = e.toStreamInfo;
    });
    this._player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, (e) => {
      if (e.mediaType === 'audio' || e.mediaType === 'video') {
        this.pendingIndex[e.mediaType] = e.newQuality + 1;
      }
    });
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
  load(streamAddr: string): void {
    this._player.attachSource(streamAddr);
  }

  /** Provide metrics to be displayed in live chart */
  getMetrics(): Metrics {

    if (!this.streamInfo) {
      return {};
    }

    const dashMetrics: dashjs.DashMetrics = this._player.getDashMetrics();
    const dashAdapter: dashjs.DashAdapter = this._player.getDashAdapter();
    const period: (dashjs.Period | null) = dashAdapter.getPeriodById(this.streamInfo.id);
    const periodIndex = period ? period.index : this.streamInfo.index;
    const repSwitchAudio = dashMetrics.getCurrentRepresentationSwitch('audio');
    const repSwitchVideo = dashMetrics.getCurrentRepresentationSwitch('video');
    const metrics: Metrics = {};

    // Buffer Length
    metrics.bufferLevel = {
      audio: dashMetrics.getCurrentBufferLevel('audio'),
      video: dashMetrics.getCurrentBufferLevel('video')
    };
    ////

    // Bitrate Downloading
    let bitrateAudio = NaN;
    let bitrateVideo = NaN;

    if (repSwitchAudio && typeof repSwitchAudio === 'object' && hasOwnProperty(repSwitchAudio, 'to')
        && typeof repSwitchAudio.to === 'string') {

      bitrateAudio = Math.round(dashAdapter.getBandwidthForRepresentation(repSwitchAudio.to, periodIndex) / 1000);
    }
    if (repSwitchVideo && typeof repSwitchVideo === 'object' && hasOwnProperty(repSwitchVideo, 'to')
      && typeof repSwitchVideo.to === 'string') {

      bitrateVideo = Math.round(dashAdapter.getBandwidthForRepresentation(repSwitchVideo.to, periodIndex) / 1000);
    }

    metrics.bitrateDownload = {
      audio: bitrateAudio,
      video: bitrateVideo
    };
    ////

    // Quality Index
    metrics.qualityIndex = {
      audio: {
        current: this._player.getQualityFor('audio'),
        max: dashAdapter.getMaxIndexForBufferType('audio', periodIndex)
      },
      video: {
        current: this._player.getQualityFor('video'),
        max: dashAdapter.getMaxIndexForBufferType('video', periodIndex)
      }
    };
    ////

    // Quality Index Pending
    metrics.qualityIndexPending = this.pendingIndex;
    ////

    // Dropped Frames
    const droppedFrames = dashMetrics.getCurrentDroppedFrames()?.droppedFrames ?? 0;
    metrics.droppedFrames = { video: droppedFrames };
    ////



    // TODO: more metrics..

    return metrics;

  }

}
