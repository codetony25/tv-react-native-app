import { Platform } from 'react-native';
import GoogleAnalytics, {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge';

import { ANALYTICS_TRACKING_ID, SETTINGS } from '../../config';
import DeviceState from '../DeviceState/DeviceState.js';

/**
 * Google Analytics and Google Tag Manager specific
 * information state management
 */
class AnalyticState {

  constructor() {
    this.handleAnalyticInit();
    this.handleAnalyticContainers();
    this.handleAnalyticSettings();
  }

  handleAnalyticInit = () => {
    this.activeAnalytics = this.getSpecificDeviceAnalyticTrackerId();
    this.GTM = GoogleTagManager;
    this.GA = new GoogleAnalyticsTracker(this.activeAnalytics.GA);
    this.GA.setAppName('JasminTV');
  };

  handleAnalyticSettings = () => {
    GoogleAnalyticsSettings.setDryRun(SETTINGS.isDryRunForGoogleAnalaytics);
    GoogleAnalyticsSettings.setDispatchInterval(SETTINGS.analyticTrackingDelay);
  };

  handleAnalyticContainers = () => {
    try {
      this.GTM.openContainerWithId(this.activeAnalytics.GTM)
        .then(() => GoogleTagManager.stringForKey('pack'))
        .then((pack) => console.log('GTM Pack: ', pack));

      GoogleAnalytics.setTrackerId(this.activeAnalytics.GA);
    }
    catch(error) {
      throw new Error(error);
    }
  };

  getSpecificDeviceAnalyticTrackerId = () => {
    if (DeviceState.isIOS) {
      return ANALYTICS_TRACKING_ID.ios;
    }
    else if (DeviceState.isAmazonFireTv) {
      return ANALYTICS_TRACKING_ID.amazon;
    }
    else if (DeviceState.isAndroidMobile) {
      return ANALYTICS_TRACKING_ID.android;
    }
    else if (DeviceState.isTvOS) {
      return ANALYTICS_TRACKING_ID.tvos;
    }
    else {
      throw new Error('Google Analytics did not find a device to track');
    }
  }

}

export default new AnalyticState();
export { AnalyticState };
