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

    // Download Time
    const m: object[] = dashMetrics.getHttpRequests('video');
    ////

    /*
    var httpMetrics = calculateHTTPMetrics(type, dashMetrics.getHttpRequests(type));
            if (httpMetrics) {
                $scope[type + 'Download'] = httpMetrics.download[type].low.toFixed(2) + ' | ' + httpMetrics.download[type].average.toFixed(2) + ' | ' + httpMetrics.download[type].high.toFixed(2);
                $scope[type + 'Latency'] = httpMetrics.latency[type].low.toFixed(2) + ' | ' + httpMetrics.latency[type].average.toFixed(2) + ' | ' + httpMetrics.latency[type].high.toFixed(2);
                $scope[type + 'Ratio'] = httpMetrics.ratio[type].low.toFixed(2) + ' | ' + httpMetrics.ratio[type].average.toFixed(2) + ' | ' + httpMetrics.ratio[type].high.toFixed(2);
            }

            if ($scope.chartCount % 2 === 0) {
                var time = getTimeForPlot();
                $scope.plotPoint('buffer', type, bufferLevel, time);
                $scope.plotPoint('index', type, index, time);
                $scope.plotPoint('bitrate', type, bitrate, time);
                $scope.plotPoint('droppedFPS', type, droppedFPS, time);
                $scope.plotPoint('liveLatency', type, liveLatency, time);

                if (httpMetrics) {
                    $scope.plotPoint('download', type, httpMetrics.download[type].average.toFixed(2), time);
                    $scope.plotPoint('latency', type, httpMetrics.latency[type].average.toFixed(2), time);
                    $scope.plotPoint('ratio', type, httpMetrics.ratio[type].average.toFixed(2), time);
                }
                $scope.safeApply();
            }
    */

    // TODO: more metrics..

    return metrics;

  }

  calculateHTTPMetrics(type: 'audio' | 'video', requests: object[]): number {


    return 0;
  }

  /*
  function calculateHTTPMetrics(type, requests) {
        var latency = {},
            download = {},
            ratio = {};

        var requestWindow = requests.slice(-20).filter(function (req) {
            return req.responsecode >= 200 && req.responsecode < 300 && req.type === 'MediaSegment' && req._stream === type && !!req._mediaduration;
        }).slice(-4);

        if (requestWindow.length > 0) {
            var latencyTimes = requestWindow.map(function (req) {
                return Math.abs(req.tresponse.getTime() - req.trequest.getTime()) / 1000;
            });

            latency[type] = {
                average: latencyTimes.reduce(function (l, r) {
                    return l + r;
                }) / latencyTimes.length,
                high: latencyTimes.reduce(function (l, r) {
                    return l < r ? r : l;
                }),
                low: latencyTimes.reduce(function (l, r) {
                    return l < r ? l : r;
                }),
                count: latencyTimes.length
            };

            var downloadTimes = requestWindow.map(function (req) {
                return Math.abs(req._tfinish.getTime() - req.tresponse.getTime()) / 1000;
            });

            download[type] = {
                average: downloadTimes.reduce(function (l, r) {
                    return l + r;
                }) / downloadTimes.length,
                high: downloadTimes.reduce(function (l, r) {
                    return l < r ? r : l;
                }),
                low: downloadTimes.reduce(function (l, r) {
                    return l < r ? l : r;
                }),
                count: downloadTimes.length
            };

            var durationTimes = requestWindow.map(function (req) {
                return req._mediaduration;
            });

            ratio[type] = {
                average: (durationTimes.reduce(function (l, r) {
                    return l + r;
                }) / downloadTimes.length) / download[type].average,
                high: durationTimes.reduce(function (l, r) {
                    return l < r ? r : l;
                }) / download[type].low,
                low: durationTimes.reduce(function (l, r) {
                    return l < r ? l : r;
                }) / download[type].high,
                count: durationTimes.length
            };

            return {
                latency: latency,
                download: download,
                ratio: ratio
            };

        }
        return null;
    }
  */

}
