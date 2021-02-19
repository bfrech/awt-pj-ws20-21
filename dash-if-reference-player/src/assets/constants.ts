const  constants  = {
  logLevel : {
    NONE: false,
    FATAL: false,
    ERROR: false,
    WARNING: true,
    INFO: false,
    DEBUG: false
  },

  movingAverageMethod : {
    slidingWindow: true,
    ewma: false
  },

  aBRStrategy : {
    abrDynamic: true,
    abrBola: false,
    abrL2A: false,
    abrLoLP: false,
    abrThroughput: false
  },

  fetchThroughputCalculationMode : {
    abrFetchThroughputCalculationDownloadedData: true,
    abrFetchThroughputCalculationMoofParsing: false
  },

  livecatchupMode : {
    liveCatchupModeDefault: true,
    liveCatchupModeLoLP: false
  },

  trackSwitchMode : {
    audio: {
      alwaysReplace: true,
      neverReplace: false
    },
    video: {
      alwaysReplace: true,
      neverReplace: false
    }
  },

  selectionModeForInitialTrack : {
    highestBitrate: true,
    widestRange: false
  }
};






