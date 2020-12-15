const settings = {
  playback: {
    autoplay: false,
    loop: true,
    scheduleWhilePaused: true,
    fastSwitchEnabled: false,
    metricsMaxListDepth: 1000,
    autoSwitchBitrateAudio: true,
  },
  trackSwitchMode: {
    minDrift: 0.02,
    maxDrift: 0,
    playbackRate: 0.5,
    latencyThreshold: '',
  },
  playback2: {
    autoplay: false,
    loop: true,
    scheduleWhilePaused: true,
    fastSwitchEnabled: false,
    metricsMaxListDepth: 1000,
    autoSwitchBitrateAudio: true,
  },
  test: {
    minDrift: 0.02,
    maxDrift: 0,
    playbackRate: 0.5,
    latencyThreshold: '',
  },
  lowLatencyMode: {
    minDrift: 0.02,
    maxDrift: 0,
    playbackRate: 0.5,
    latencyThreshold: '',
    trackSwitchMode: {
      audio: true,
      video: true,
    },
  }
}

const testSettings = {
  debug: {
    logLevel: true,
  },
  streaming: {
    metricsMaxListDepth: 1000,
    abandonLoadTimeout: 10000,
    liveDelayFragmentCount: NaN,
    liveDelay: null,
    scheduleWhilePaused: true,
    fastSwitchEnabled: false,
    flushBufferAtTrackSwitch: false,
    calcSegmentAvailabilityRangeFromTimeline: false,
    bufferPruningInterval: 10,
    bufferToKeep: 20,
    jumpGaps: true,
    jumpLargeGaps: true,
    smallGapLimit: 1.5,
    stableBufferTime: 12,
    bufferTimeAtTopQuality: 30,
    bufferTimeAtTopQualityLongForm: 60,
    longFormContentDurationThreshold: 600,
    wallclockTimeUpdateInterval: 50,
    lowLatencyEnabled: false,
    keepProtectionMediaKeys: false,
    useManifestDateHeaderTimeSource: true,
    useSuggestedPresentationDelay: true,
    useAppendWindow: true,
    manifestUpdateRetryInterval: 100,
    liveCatchup: {
      minDrift: 0.02,
      maxDrift: 0,
      playbackRate: 0.5,
      latencyThreshold: NaN,
      enabled: false
    },
    lastBitrateCachingInfo: {enabled: true, ttl: 360000},
    lastMediaSettingsCachingInfo: {enabled: true, ttl: 360000},
    cacheLoadThresholds: {video: 50, audio: 5},
    trackSwitchMode: {
      audio: true,
      video: true,
    },
    selectionModeForInitialTrack: true,
    fragmentRequestTimeout: 0,
    retryIntervals: {
      lowLatencyReductionFactor: 10
    },
    retryAttempts: {

      lowLatencyMultiplyFactor: 5
    },
    abr: {
      movingAverageMethod: true,
      useDefaultABRRules: true,
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
    cmcd: {
      enabled: false,
      sid: null,
      cid: null
    }
  }
}

function printSettings() {
  return testSettings;
}
