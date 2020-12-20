/**
 * Hardcoded order of the Setting Group we want to display
 */
const settingGroups  = {
  PLAYBACK: {
    fastSwitchEnabled: 'Fast Switch Enabled',
    flushBufferAtTrackSwitch: 'Flush Buffer at Track Switch',
    jumpGaps: 'Jump Small Gaps',
    jumpLargeGaps: 'Jump Large Gaps',
    smallGapLimit: 'Small Gap Limit',
    lastBitrateCachingInfo: 'Last Bitrate Caching Info',
    lastMediaSettingsCachingInfo: 'Last Media Setting Caching Info',
    cacheLoadThresholds: 'Cache Load Thresholds',
  },
  ABR : {
    movingAverageMethod: 'Moving Average Method',
    ABRStrategy: 'ABR Strategy',
    bandwidthSafetyFactor: 'Bandwith safety factor',
    useDefaultABRRules: 'Use default ABR rules',
    useBufferOccupancyABR: 'Use buffer occupancy ABR',
    useDeadTimeLatency: 'Use dead dime datency',
    limitBitrateByPortal: 'Limit bitrate by portal',
    usePixelRatioInLimitBitrateByPortal: 'Use pixel ratio in limit bitrate by portal',
    maxBitrate: {audio: 'MaxBitrate audio', video: 'MaxBitrate video'},
    minBitrate: {audio: 'MinBitrate audio', video: 'MinBitrate video'},
    maxRepresentationRatio: {audio: 'maxRepresentationRatio audio', video: 'maxRepresentationRatio video'},
    initialBitrate: {audio: 'Initial Bitrate audio', video: 'Initial Bitrate video'},
    initialRepresentationRatio: {audio: 'Initial Representation Ratio audio', video: 'Initial Representation Ratio video'},
    autoSwitchBitrate: {audio: 'Auto Switch Bitrate audio', video: 'Auto Switch Bitrate video'}
  },
  INITIAL : {
    abandonLoadTimeout: 'Abandon load timeout',
    scheduleWhilePaused: 'Schedule While Paused',
  },
  LOWLATENCY : {
    liveDelay: 'Live delay',
    lowLatencyEnabled: 'Enable Low Latency',
    liveCatchUpMinDrift: 'Live Catch Up min Drift',
    liveCatchUpMaxDrift: 'Live Catch Up max Drift',
    liveCatchUpPlaybackRate: 'Live Catch Up Playback Rate',
    liveCatchupLatencyThreshold: 'Live Catch Up Latency Threshold',
    lowLatencyMultiplyFactor: 'Low Latency Multiply Factor'
  },
  DEBUG : {
    logLevel: 'logLevel',
  },
  CMCD : {
    enabled: 'Enable CMCD',
    sid: 'SID',
    cid: 'CID',
    did: 'DID'
  },
  BUFFER : {
    bufferPruningInterval: 'Buffer Pruning Interval',
    bufferToKeep: 'Buffer to Keep',
    stableBufferTime: 'Stable Buffer Time',
    bufferTimeAtTopQuality: 'Buffer Time At Top Quality',
    bufferTimeAtTopQualityLongForm: 'Buffer Time At Top Quality Long Form',
  }
};

const order = {
    metricsMaxListDepth: undefined,
    liveDelayFragmentCount: undefined,
    calcSegmentAvailabilityRangeFromTimeline: undefined,
    longFormContentDurationThreshold: undefined,
    wallclockTimeUpdateInterval: undefined,
    keepProtectionMediaKeys: undefined,
    useManifestDateHeaderTimeSource: undefined,
    useSuggestedPresentationDelay: undefined,
    useAppendWindow: undefined,
    manifestUpdateRetryInterval: undefined,
    retryIntervals: {
      MPD: 500,
      XLinkExpansion: 500,
      InitializationSegment: 1000,
      IndexSegment: 1000,
      MediaSegment: 1000,
      BitstreamSwitchingSegment: 1000,
      other: 1000,
      lowLatencyReductionFactor: 10
    },
};


