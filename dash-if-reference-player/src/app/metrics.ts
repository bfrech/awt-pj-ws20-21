
/** Interfaces for metrics data provided by player.service */
export interface MetricsAVG { min: number; avg: number; max: number; }

export interface Metrics {
  bufferLevel?: { audio?: number, video?: number };
  bitrateDownload?: { audio?: number, video?: number };
  qualityIndex?: {
    audio?: { current: number, max: number },
    video?: { current: number, max: number }
  };
  qualityIndexPending?: { audio?: number, video?: number };
  droppedFrames?: { video?: number };
  latency?: {
    audio?: MetricsAVG,
    video?: MetricsAVG
  };
  liveLatency?: { stream?: number };
  segDownloadTime?: {
    audio?: MetricsAVG,
    video?: MetricsAVG
  };
  playbackDownloadTimeRatio?: {
    audio?: MetricsAVG,
    video?: MetricsAVG
  };
}


/** Interface for selectable metric options */
export interface MetricOption {
  name: string;                                 // Display name
  description: string;                          // Tooltip description
  type: 'a' | 'v' | 'av' | 'stream';            // Metric can belong to audio only, video only, audio and video, stream
  key: string;                                  // Key to access metric in Metric object
  chartInfo?: string;                           // Add info to metric name in chart. Eg unit.
}


/** Array of available options */
export const METRICOPTIONS: MetricOption[] = [
  { name: 'Buffer Length',
    description: 'The length of the forward buffer, in seconds',
    type: 'av',
    key: 'bufferLevel',
    chartInfo: '/ seconds' },
  { name: 'Bitrate Downloading',
    description: 'The bitrate of the representation being downloaded',
    type: 'av',
    key: 'bitrateDownload',
    chartInfo: '/ kbps' },
  { name: 'Quality Index',
    description: 'The representation index being rendered',
    type: 'av',
    key: 'qualityIndex',
    chartInfo: '(avg)' },
  { name: 'Quality Index Pending',
    description: 'The representation index being downloaded and appended to the buffer',
    type: 'av',
    key: 'qualityIndexPending' },
  { name: 'Dropped Frames',
    description: 'The absolute count of frames dropped by the rendering pipeline since play commenced',
    type: 'v',
    key: 'droppedFrames' },
  { name: 'Download Time',
    description: 'The minimum, average and maximum download time for the last 4 requested segments. Download time is' +
      ' the time in milli-seconds from first byte being received to the last byte',
    type: 'av',
    key: 'segDownloadTime',
    chartInfo: '/ ms' },
  { name: 'Playback Ratio',
    description: 'The minimum, average and maximum ratio of the segment playback time to total download time over the' +
      ' last 4 segments',
    type: 'av',
    key: 'playbackDownloadTimeRatio' },
  { name: 'Latency',
    description: 'The minimum, average and maximum latency over the last 4 requested segments. Latency is the time in' +
      ' milli-seconds from request of segment to receipt of first byte',
    type: 'av',
    key: 'latency',
    chartInfo: '/ ms' },
  { name: 'Live Latency',
    description: 'Difference between live time and current playback position in seconds. This latency estimate does' +
      ' not include the time taken by the encoder to encode the content',
    type: 'stream',
    key: 'liveLatency',
    chartInfo: '/ seconds' }
];
