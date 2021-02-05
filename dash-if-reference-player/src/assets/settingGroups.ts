/**
 * Hardcoded order of the Setting Group we want to display
 */
const settingGroups  = {
  PLAYBACK: {
    flushBufferAtTrackSwitch: false,
    jumpGaps: true,
    jumpLargeGaps: true,
    smallGapLimit: 1.5,
    lastBitrateCachingInfo: { enabled: true, ttl: 360000 },
    lastMediaSettingsCachingInfo: { enabled: true, ttl: 360000 },
    cacheLoadThresholds: { video: 50, audio: 5 },
    scheduleWhilePaused: true,
    calcSegmentAvailabilityRangeFromTimeline: true,
    reuseExistingSourceBuffers: true,
  },
  ABR : {
    fastSwitchEnabled: false,  // Fast Switching ABR
    movingAverageMethod: 'Constants.MOVING_AVERAGE_SLIDING_WINDOW',
    ABRStrategy: 'ABR Strategy',
    bandwidthSafetyFactor: 0.9,
    useDefaultABRRules: true,
    useBufferOccupancyABR: false,
    useDeadTimeLatency: true,
    limitBitrateByPortal: false,
    usePixelRatioInLimitBitrateByPortal: false,
    maxRepresentationRatio: {audio: 1, video: 1},
    initialBitrate: {audio: -1, video: -1},
    initialRepresentationRatio: {audio: -1, video: -1},
    autoSwitchBitrate: {audio: true, video: true},
    fetchThroughputCalculationMode: 'Constants.ABR_FETCH_THROUGHPUT_CALCULATION_DOWNLOADED_DATA',
  },
  INITIAL : {
    liveDelay: null,
    abandonLoadTimeout: 1000,
    maxBitrate: {audio: -1, video: -1},
    minBitrate: {audio: -1, video: -1},
    selectionModeForInitialTrack: 'Constants.TRACK_SELECTION_MODE_HIGHEST_BITRATE',
  },
  LOWLATENCY : {
    lowLatencyEnabled: false,
    liveCatchUpMinDrift: 0.02,
    liveCatchUpMaxDrift: 0,
    liveCatchUpPlaybackRate: 0.5,
    liveCatchupLatencyThreshold: NaN,
    lowLatencyMultiplyFactor: 5,
    liveDelayFragmentCount: NaN,
    liveCatchup: true,
  },
  DEBUG : {
    logLevel: 'warning',
    dispatchEvent: false,
  },
  CMCD : {
    enabled: false,
    sid: null,
    cid: null,
    did: null
  },
  BUFFER : {
    bufferPruningInterval: 10,
    bufferToKeep: 20,
    stableBufferTime: 12,
    bufferTimeAtTopQuality: 30,
    bufferTimeAtTopQualityLongForm: 60,
  },
  'TRACK SWITCH': {
    trackSwitchMode: 'CONSTANTS',
  },
  RETRY: {
    retryIntervals: 'test'
  }
};


/* Still needs to be assigned to Group */
const order = {
    metricsMaxListDepth: 1000,
    longFormContentDurationThreshold: 600,
    wallclockTimeUpdateInterval: 50,
    keepProtectionMediaKeys: false,
    useManifestDateHeaderTimeSource: true,
    useSuggestedPresentationDelay: true,
    useAppendWindow: true,
    manifestUpdateRetryInterval: 100,
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
