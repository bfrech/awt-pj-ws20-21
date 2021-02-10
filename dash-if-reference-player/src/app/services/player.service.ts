import { Injectable } from '@angular/core';
import * as dashjs from 'dashjs';
import '../types/dashjs-types';
import { hasOwnProperty } from '../../assets/hasownproperty';
import { Metrics, MetricsAVG } from '../metrics';


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
  private pendingIndex: { [index: string]: number } = {
    audio: NaN,
    video: NaN
  };

  constructor() {

    // Create player instance and setup listeners for player events
    this._player = dashjs.MediaPlayer().create();
    this._player.on(dashjs.MediaPlayer.events.PERIOD_SWITCH_COMPLETED, (e) => {
      this.streamInfo = e.toStreamInfo;
    });
    this._player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, (e) => {
      this.pendingIndex[e.mediaType] = e.newQuality + 1;
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

    const metrics: Metrics = {};
    // Define metricsMediaTypes with const assertion to get type safe object keys
    const metricsMediaTypes = ['audio', 'video'] as const;

    // Iterate over metrics media types
    for (const type of metricsMediaTypes) {

      const repSwitch = dashMetrics.getCurrentRepresentationSwitch(type);

      // Buffer Length
      if (!metrics.bufferLevel) {
        metrics.bufferLevel = {};
      }
      metrics.bufferLevel[type] = dashMetrics.getCurrentBufferLevel(type);
      ////

      // Bitrate Downloading
      if (repSwitch && typeof repSwitch === 'object' && hasOwnProperty(repSwitch, 'to')
        && typeof repSwitch.to === 'string') {

        if (!metrics.bitrateDownload) {
          metrics.bitrateDownload = {};
        }
        metrics.bitrateDownload[type] = Math.round(dashAdapter.getBandwidthForRepresentation(repSwitch.to,
          periodIndex) / 1000);
      }
      ////

      // Quality Index
      if (!metrics.qualityIndex) {
        metrics.qualityIndex = {};
      }
      metrics.qualityIndex[type] = {
        current: this._player.getQualityFor(type),
        max: dashAdapter.getMaxIndexForBufferType(type, periodIndex)
      };
      ////

      // Quality Index Pending
      if (!metrics.qualityIndexPending) {
        metrics.qualityIndexPending = {};
      }
      metrics.qualityIndexPending[type] = this.pendingIndex[type];
      ////

      // Dropped Frames (video only)
      if (type === 'video') {
        if (!metrics.droppedFrames) {
          metrics.droppedFrames = {};
        }
        metrics.droppedFrames[type] = dashMetrics.getCurrentDroppedFrames()?.droppedFrames ?? 0;
      }
      ////

      // HTTP Metrics
      const httpRequests = dashMetrics.getHttpRequests(type) as Array<dashjs.HTTPRequest>;
      const httpMetrics = this.calculateHTTPMetrics(type, httpRequests);

      if (httpMetrics) {

        if (!metrics.latency) {
          metrics.latency = {};
        }
        metrics.latency[type] = httpMetrics.latency;

        if (!metrics.segDownloadTime) {
          metrics.segDownloadTime = {};
        }
        metrics.segDownloadTime[type] = httpMetrics.segDownloadTime;

        if (!metrics.playbackDownloadTimeRatio) {
          metrics.playbackDownloadTimeRatio = {};
        }
        metrics.playbackDownloadTimeRatio[type] = httpMetrics.playbackDownloadTimeRatio;
      }
      ////

      // Live Latency (audio only)
      if (type === 'audio') {
        if (!metrics.liveLatency) {
          metrics.liveLatency = {};
        }
        metrics.liveLatency[type] = this._player.getCurrentLiveLatency();
      }
      ////
    }

    return metrics;
  }

  calculateHTTPMetrics(type: 'audio' | 'video', requests: Array<dashjs.HTTPRequest>): { latency: MetricsAVG,
                                                                        segDownloadTime: MetricsAVG,
                                                                        playbackDownloadTimeRatio: MetricsAVG } | null {

    let latency: MetricsAVG;
    let segDownloadTime: MetricsAVG;
    let playbackDownloadTimeRatio: MetricsAVG;

    const requestWindow = requests.slice(-20).filter( req => req.responsecode >= 200 && req.responsecode < 300
                                                              && req.type === 'MediaSegment' && req._stream === type
                                                              && !!req._mediaduration ).slice(-4);

    if (requestWindow.length > 0) {

      const latencyTimes = requestWindow.map( req => Math.abs(req.tresponse.getTime() - req.trequest.getTime()));

      latency = {
        min: latencyTimes.reduce((l, r) => l < r ? l : r),
        avg: latencyTimes.reduce((l, r) => l + r) / latencyTimes.length,
        max: latencyTimes.reduce((l, r) => l < r ? r : l)
      };

      const downloadTimes = requestWindow.map(req => Math.abs(req._tfinish.getTime() - req.tresponse.getTime()));

      segDownloadTime = {
        min: downloadTimes.reduce((l, r) => l < r ? l : r),
        avg: downloadTimes.reduce((l, r) => l + r) / downloadTimes.length,
        max: downloadTimes.reduce((l, r) => l < r ? r : l)
      };

      const durationTimes = requestWindow.map(req => req._mediaduration);

      playbackDownloadTimeRatio = {
        min: durationTimes.reduce((l, r) => l < r ? l : r) / segDownloadTime.max,
        avg: (durationTimes.reduce((l, r) => l + r) / downloadTimes.length) / segDownloadTime.avg,
        max: durationTimes.reduce((l, r) => l < r ? r : l) / segDownloadTime.min
      };

      return {
        latency,
        segDownloadTime,
        playbackDownloadTimeRatio
      };

    }

    return null;
  }

}
