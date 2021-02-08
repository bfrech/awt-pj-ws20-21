
/** Interface for metrics data provided by player.service */
export interface Metrics {
  bufferLevel?: { audio: number, video: number };
  bitrateDownload?: { audio: number, video: number };
  qualityIndex?: {
    audio: { current: number, max: number },
    video: { current: number, max: number }
  };
  qualityIndexPending?: { audio: number, video: number };
  droppedFrames?: { video: number };
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


/** Interface for selectable metric options */
export interface MetricOption { name: string; type: 'a' | 'v' | 'av'; key: string; chartInfo?: string; }


/** Array of available options */
export const METRICOPTIONS: MetricOption[] = [
  { name: 'Buffer Length', type: 'av', key: 'bufferLevel', chartInfo: '/ seconds' },
  { name: 'Bitrate Downloading', type: 'av', key: 'bitrateDownload', chartInfo: '/ kbps' },
  { name: 'Quality Index', type: 'av', key: 'qualityIndex', chartInfo: 'avg' },
  { name: 'Quality Index Pending', type: 'av', key: 'qualityIndexPending' },
  { name: 'Dropped Frames', type: 'v', key: 'droppedFrames' },
  { name: 'Download Time', type: 'av', key: 'segDownloadTime' },
  { name: 'Playback Ratio', type: 'av', key: 'playbackDownloadTimeRatio' },
  { name: 'Latency', type: 'av', key: 'latency' },
  { name: 'Live Latency', type: 'a', key: 'liveLatency' }
];
