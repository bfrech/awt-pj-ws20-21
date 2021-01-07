
/**
 * Hardcoded order of the Setting Group we want to display
 */
const settingGroups  = {
  PLAYBACK: {
    fastSwitchEnabled: false,
    flushBufferAtTrackSwitch: false,
    jumpGaps: true,
    jumpLargeGaps: true,
    smallGapLimit: 1.5,
    lastBitrateCachingInfo: { enabled: true, ttl: 360000 },
    lastMediaSettingsCachingInfo: { enabled: true, ttl: 360000 },
    cacheLoadThresholds: { video: 50, audio: 5 },
  },
  ABR : {
    movingAverageMethod: 'Constants.MOVING_AVERAGE_SLIDING_WINDOW',
    ABRStrategy: 'ABR Strategy',
    bandwidthSafetyFactor: 0.9,
    useDefaultABRRules: true,
    useBufferOccupancyABR: false,
    useDeadTimeLatency: true,
    limitBitrateByPortal: false,
    usePixelRatioInLimitBitrateByPortal: false,
    maxBitrate: {audio: -1, video: -1},
    minBitrate: {audio: -1, video: -1},
    maxRepresentationRatio: {audio: 1, video: 1},
    initialBitrate: {audio: -1, video: -1},
    initialRepresentationRatio: {audio: -1, video: -1},
    autoSwitchBitrate: {audio: true, video: true}
  },
  INITIAL : {
    abandonLoadTimeout: 1000,
    scheduleWhilePaused: true,
  },
  LOWLATENCY : {
    liveDelay: null,
    lowLatencyEnabled: false,
    liveCatchUpMinDrift: 0.02,
    liveCatchUpMaxDrift: 0,
    liveCatchUpPlaybackRate: 0.5,
    liveCatchupLatencyThreshold: NaN,
    lowLatencyMultiplyFactor: 5,
    liveDelayFragmentCount: NaN,
  },
  DEBUG : {
    logLevel: 'logLevel',
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
  }
};


/* Still needs to be assigned to Group */
const order = {
    metricsMaxListDepth: 1000,
    calcSegmentAvailabilityRangeFromTimeline: true,
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


