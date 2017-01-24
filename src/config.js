// Application Settings
export const SETTINGS = {

  // Set to true if you do not want to send tracked data to Google Analytics
  isDryRunForGoogleAnalaytics: false,

  // Set to true if you want to log device information in the console
  isDeviceInfoLogging: false,

  // Google Analytics tracking delay in seconds
  analyticTrackingDelay: 20
};

// Video Urls with JSON data
export const VIDEO_URL = {
  mobile: {
    ios: 'http://ott-channel-api.doclerdev.com/jasmin?device=apple',
    android: 'http://ott-channel-api.doclerdev.com/jasmin?device=android',
    google: 'http://ott-channel-api.doclerdev.com/jasmin?device=amazonfire'
  },
  tv: {

    // Staging URL: http://stage.ott.doclerdev.com:3000/jasmin?device=amazonfire
    amazon: 'http://ott-channel-api.doclerdev.com/jasmin?device=amazonfire',
    roku: 'http://ott-channel-api.doclerdev.com/jasmin?device=roku'
  }
};

// Google Analytics Tracking Codes
export const ANALYTICS_TRACKING_ID = {
  amazon: {
    GTM: 'GTM-W3C52NL',
    GA: 'UA-89113415-4'
  },
  android: {
    GTM: 'GTM-NVFS87Q',
    GA: 'UA-89113415-3'
  },
  ios: {
    GTM: 'GTM-PF2M95C',
    GA: 'UA-89113415-1'
  },
  tvos: {
    GTM: 'GTM-PVZGBWQ',
    GA: 'UA-89113415-2'
  }
};
