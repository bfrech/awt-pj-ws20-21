
/** Interface for metrics data provided by player.service */
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


/** Interface for selectable metric options */
export interface MetricOption { name: string; type: 'a' | 'v' | 'av'; key: string; unit?: string; }


/** Array of available options */
export const METRICOPTIONS: MetricOption[] = [
  { name: 'Buffer Length', type: 'av', key: 'bufferLevel', unit: 'seconds' },
  { name: 'Bitrate Downloading', type: 'av', key: 'bitrateDownload', unit: 'kbps' },
  { name: 'Quality Index', type: 'av', key: 'qualityIndex' },
  { name: 'Quality Index Pending', type: 'av', key: 'qualityIndexPending' },
  { name: 'Dropped Frames', type: 'av', key: 'droppedFrames' },
  { name: 'Download Time', type: 'av', key: 'segDownloadTime' },
  { name: 'Playback Ratio', type: 'av', key: 'playbackDownloadTimeRatio' },
  { name: 'Latency', type: 'av', key: 'latency' },
  { name: 'Live Latency', type: 'a', key: 'liveLatency' }
];
