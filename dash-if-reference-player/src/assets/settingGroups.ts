/**
 * Hardcoded order of the Setting Group we want to display
 */
const settingGroups = {
  PLAYBACK: {
    flushBufferAtTrackSwitch: 'When enabled, after a track switch and in case buffer is being replaced (see MEdiaPlayer.setTrackSwitchModeFor(Constants.TRACK_SWITCH_MODE_ALWAYS_REPLACE)), the video element is flushed (seek at current playback time) once a segment of the new track is appended in buffer in order to force video decoder to play new track. This can be required on some devices like GoogleCast devices to make track switching functional. Otherwise track switching will be effective only once after previous buffered track is fully consumed.',
    jumpGaps: 'Sets whether player should jump small gaps (discontinuities) in the buffer',
    jumpLargeGaps: 'Sets whether player should jump large gaps (discontinuities) in the buffer',
    smallGapLimit: 'Time in seconds for a gap to be considered small',
    lastBitrateCachingInfo: 'Set to false if you would like to disable the last known bit rate from being stored during playback and used to set the initial bit rate for subsequent playback within the expiration window.\n' +
      '\n' +
      'The default expiration is one hour, defined in milliseconds. If expired, the default initial bit rate (closest to 1000 kbps) will be used for that session and a new bit rate will be stored during that session.',
    lastMediaSettingsCachingInfo: 'Set to false if you would like to disable the last known lang for audio (or camera angle for video) from being stored during playback and used to set the initial settings for subsequent playback within the expiration window.\n' +
      '\n' +
      'The default expiration is one hour, defined in milliseconds. If expired, the default settings will be used for that session and a new settings will be stored during that session.',
    cacheLoadThresholds: 'For a given media type, the threshold which defines if the response to a fragment request is coming from browser cache or not.\n' +
      '\n',
    scheduleWhilePaused: 'Set to true if you would like dash.js to keep downloading fragments in the background when the video element is paused',
    calcSegmentAvailabilityRangeFromTimeline: 'Enable calculation of the DVR window for SegmentTimeline manifests based on the entries in',
    reuseExistingSourceBuffers: 'Enable reuse of existing MediaSource Sourcebuffers during period transition',
  },
  ABR: {
    fastSwitchEnabled: 'When enabled, after an ABR up-switch in quality, instead of requesting and appending the next fragment at the end of the current buffer range it is requested and appended closer to the current time When enabled, The maximum time to render a higher quality is current time + (1.5 * fragment duration).\n' +
      'Note, When ABR down-switch is detected, we appended the lower quality at the end of the buffer range to preserve the higher quality media for as long as possible.\n' +
      '\n' +
      'If enabled, it should be noted there are a few cases when the client will not replace inside buffer range but rather just append at the end. 1. When the buffer level is less than one fragment duration 2. The client is in an Abandonment State due to recent fragment abandonment event.\n' +
      '\n' +
      'Known issues:\n' +
      '\n' +
      'In IE11 with auto switching off, if a user switches to a quality they can not download in time the fragment may be appended in the same range as the playhead or even in the past, in IE11 it may cause a stutter or stall in playback.',  // Fast Switching ABR
    movingAverageMethod: 'Sets the moving average method used for smoothing throughput estimates. Valid methods are "slidingWindow" and "ewma". The call has no effect if an invalid method is passed.\n' +
      '\n' +
      'The sliding window moving average method computes the average throughput using the last four segments downloaded. If the stream is live (as opposed to VOD), then only the last three segments are used. If wide variations in throughput are detected, the number of segments can be dynamically increased to avoid oscillations.\n' +
      '\n' +
      'The exponentially weighted moving average (EWMA) method computes the average using exponential smoothing. Two separate estimates are maintained, a fast one with a three-second half life and a slow one with an eight-second half life. The throughput estimate at any time is the minimum of the fast and slow estimates. This allows a fast reaction to a bandwidth drop and prevents oscillations on bandwidth spikes.',
    ABRStrategy: 'Returns the current ABR strategy being used: "abrDynamic", "abrBola" or "abrThroughput"',
    bandwidthSafetyFactor: 'Standard ABR throughput rules multiply the throughput by this value. It should be between 0 and 1, with lower values giving less rebuffering (but also lower quality).',
    useDefaultABRRules: 'Should the default ABR rules be used, or the custom ones added.',
    useBufferOccupancyABR: 'no description available yet',
    useDeadTimeLatency: 'If true, only the download portion will be considered part of the download bitrate and latency will be regarded as static. If false, the reciprocal of the whole transfer time will be used.',
    limitBitrateByPortal: 'If true, the size of the video portal will limit the max chosen video resolution.',
    usePixelRatioInLimitBitrateByPortal: 'Sets whether to take into account the device\'s pixel ratio when defining the portal dimensions. Useful on, for example, retina displays.',
    maxRepresentationRatio: 'When switching multi-bitrate content (auto or manual mode) this property specifies the maximum representation allowed, as a proportion of the size of the representation set.\n' +
      '\n' +
      'You can set or remove this cap at anytime before or during playback. To clear this setting you set the value to 1.\n' +
      '\n' +
      'If both this and maxAllowedBitrate are defined, maxAllowedBitrate is evaluated first, then maxAllowedRepresentation, i.e. the lowest value from executing these rules is used.\n' +
      '\n' +
      'This feature is typically used to reserve higher representations for playback only when connected over a fast connection.',
    initialBitrate: 'Explicitly set the starting bitrate for audio or video',
    initialRepresentationRatio: 'Explicitly set the initial representation ratio. If initalBitrate is specified, this is ignored',
    autoSwitchBitrate: 'Indicates whether the player should enable ABR algorithms to switch the bitrate.\n' +
      '\n',
    fetchThroughputCalculationMode: 'Algorithm to determine the throughput in case the Fetch API is used for low latency streaming. For details please check the samples section and FetchLoader.js',
  },
  INITIAL: {
    liveDelay: 'Equivalent in seconds of setLiveDelayFragmentCount Lowering this value will lower latency but may decrease the player\'s ability to build a stable buffer. This value should be less than the manifest duration by a couple of segment durations to avoid playback issues If set, this parameter will take precedence over setLiveDelayFragmentCount and manifest info',
    maxBitrate: 'The maximum bitrate that the ABR algorithms will choose. Use NaN for no limit.',
    minBitrate: 'The minimum bitrate that the ABR algorithms will choose. Use NaN for no limit.',
    selectionModeForInitialTrack: 'no description available yet',
    wallclockTimeUpdateInterval: 'How frequently the wallclockTimeUpdated internal event is triggered (in milliseconds).',
    keepProtectionMediaKeys: 'Set the value for the ProtectionController and MediaKeys life cycle. If true, the ProtectionController and then created MediaKeys and MediaKeySessions will be preserved during the MediaPlayer lifetime.',
    useManifestDateHeaderTimeSource: 'Allows you to enable the use of the Date Header, if exposed with CORS, as a timing source for live edge detection. The use of the date header will happen only after the other timing source that take precedence fail or are omitted as described.',
    useSuggestedPresentationDelay: 'Set to true if you would like to override the default live delay and honor the SuggestedPresentationDelay attribute in by the manifest.',
  },
  LOWLATENCY: {
    lowLatencyEnabled: 'Enable or disable low latency mode',
    liveCatchUpMinDrift: 'no description available yet',
    liveCatchUpMaxDrift: 'no description available yet',
    liveCatchUpPlaybackRate: 'no description available yet',
    liveCatchupLatencyThreshold: 'no description available yet',
    lowLatencyMultiplyFactor: 'no description available yet',
    liveDelayFragmentCount: 'no description available yet',
    liveCatchup: 'Settings related to live catchup.',
  },
  DEBUG: {
    logLevel: 'Sets up the log level. The levels are cumulative. For example, if you set the log level to dashjs.Debug.LOG_LEVEL_WARNING all warnings, errors and fatals will be logged. Possible values.',
    dispatchEvent: 'Enable to trigger a Events.LOG event whenever log output is generated. Note this will be dispatched regardless of log level',
    metricsMaxListDepth: 'Maximum list depth of metrics.',
  },
  CMCD: {
    enabled: 'Enable or disable the CMCD reporting.',
    sid: 'GUID identifying the current playback session. Should be in UUID format.' +
      'If not specified a UUID will be automatically generated.',
    cid: 'A unique string to identify the current content. If not specified it will be a hash of the MPD url.',
    did: 'A unique string identifying the current device.'
  },
  BUFFER: {
    bufferPruningInterval: 'The interval of pruning buffer in sconds.',
    bufferToKeep: 'This value influences the buffer pruning logic. Allows you to modify the buffer that is kept in source buffer in seconds. 0|-----------bufferToPrune-----------|-----bufferToKeep-----|currentTime|',
    stableBufferTime: 'The time that the internal buffer target will be set to post startup/seeks (NOT top quality). When the time is set higher than the default you will have to wait longer to see automatic bitrate switches but will have a larger buffer which will increase stability.',
    bufferTimeAtTopQuality: 'The time that the internal buffer target will be set to once playing the top quality. If there are multiple bitrates in your adaptation, and the media is playing at the highest bitrate, then we try to build a larger buffer at the top quality to increase stability and to maintain media quality.',
    bufferTimeAtTopQualityLongForm: 'The time that the internal buffer target will be set to once playing the top quality for long form content.',
    useAppendWindow: 'Specifies if the appendWindow attributes of the MSE SourceBuffers should be set according to content duration from manifest.',
    longFormContentDurationThreshold: 'The threshold which defines if the media is considered long form content. This will directly affect the buffer targets when playing back at the top quality.',
    stallThreshold: 'Stall threshold used in BufferController.js to determine whether a track should still be changed and which buffer range to prune.',
  },
  'TRACK SWITCH': {
    trackSwitchMode: 'no description available yet',
  },
  RETRY: {
    manifestUpdateRetryInterval: 'For live streams, set the interval-frequency in milliseconds at which dash.js will check if the current manifest is still processed before downloading the next manifest once the minimumUpdatePeriod time has',
    abandonLoadTimeout: 'A timeout value in seconds, which during the ABRController will block switch-up events. This will only take effect after an abandoned fragment event occurs',
    retryIntervals: 'Time in milliseconds of which to reload a failed file load attempt. For low latency mode these values are divided by lowLatencyReductionFactor.',
    retryAttempts: 'Total number of retry attempts that will occur on a file load before it fails. For low latency mode these values are multiplied by lowLatencyMultiplyFactor.',
    fragmentRequestTimeout: 'Time in milliseconds before timing out on loading a media fragment. Fragments that timeout are retried as if they failed',
  },
  NONE: {
    wallclockTimeUpdateInterval: 'How frequently the wallclockTimeUpdated internal event is triggered (in milliseconds).',
    keepProtectionMediaKeys: 'Set the value for the ProtectionController and MediaKeys life cycle. If true, the ProtectionController and then created MediaKeys and MediaKeySessions will be preserved during the MediaPlayer lifetime.',
    useManifestDateHeaderTimeSource: 'Allows you to enable the use of the Date Header, if exposed with CORS, as a timing source for live edge detection. The use of the date header will happen only after the other timing source that take precedence fail or are omitted as described.',
    useSuggestedPresentationDelay: 'Set to true if you would like to override the default live delay and honor the SuggestedPresentationDelay attribute in by the manifest.',
    manifestUpdateRetryInterval: 'For live streams, set the interval-frequency in milliseconds at which dash.js will check if the current manifest is still processed before downloading the next manifest once the minimumUpdatePeriod time has',
  }
};

