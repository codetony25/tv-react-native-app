import { observable, action } from 'mobx';
import Chromecast from 'react-native-google-cast';
import { DeviceEventEmitter, Animated, Platform } from 'react-native';

import AnalyticState from '../AnalyticState/AnalyticState';

class ChromecastState {

  @observable isChromecastAround = false;
  @observable isChromecastDeviceListModalOpen = false;
  @observable isChromecastConfirmationModalOpen = false;
  @observable isConnecting = false;
  @observable isConnected = false;
  @observable isCastingPaused = false;
  @observable isMediaLoaded = false;
  @observable isDisconnected = true;
  @observable isDeviceListRecieved = null;
  @observable isDeviceScanInProgress = false;
  @observable deviceList = [];
  @observable deviceId = null;
  @observable deviceName = '';
  @observable channelTitle = null;
  @observable streamUrl = null;
  @observable imageUrl = null;
  @observable castSeekProgress = 0;
  @observable animateCastPlayerValue = new Animated.Value(60);

  constructor() {
    this.defaultTitle = 'JasminChannel';
    this.castSeekProgress = 0;
    this.defaultImageUrl =
      'http://d1tqizto1zxme7.cloudfront.net/JasminChannel_375x211.jpg';
    this.defaultChannelUrl =
      'http://jsm-tv-channels-streams.doclerdev.com/ContestTv.m3u8';

    // Start initial chromecast scan for devices
    Chromecast.startScan();

    this.handleChromecastListeners();
  }

  // Handles our seek bar animation with intervals
  @action
  startSeekProgressInterval = () => {
    const maxInterval = 100;
    const amountToIncrementInterval = 0.8;
    const intervalDelay = 0.01;

    setInterval(() => {
      if (this.castSeekProgress < maxInterval) {
        this.castSeekProgress += amountToIncrementInterval;
      }
      else if (this.castSeekProgress >= maxInterval) {
        this.castSeekProgress = 0;
      }
    }, intervalDelay);
  };

  @action
  handleChromecastListeners = () => {
    DeviceEventEmitter.addListener(Chromecast.DEVICE_AVAILABLE, (existance) => {
      this.handleDeviceAvailable(existance.device_available);
    });

    DeviceEventEmitter.addListener(Chromecast.MEDIA_LOADED, () => {
      this.handleChromecastMediaLoaded();
    });

    DeviceEventEmitter.addListener(Chromecast.DEVICE_DISCONNECTED, () => {
      this.handleDisconnect();
    });

    DeviceEventEmitter.addListener(Chromecast.DEVICE_CONNECTED, () => {
      this.handleConnected();
    });
  };

  @action
  handleConnected = () => {
    this.isDisconnected = false;
    this.isConnected = true;

    this.handleMediaCasting();
    this.handleShowCastingPlayerAnimation();

    // Start progress bar animation for cast seeking
    this.startSeekProgressInterval();
  };

  @action
  handleDeviceAvailable = (existance) => {
    this.isChromecastAround = existance;
  };

  @action
  handleChromecastMediaLoaded = () => {
    this.isMediaLoaded = true;

    // Stop cast seek progress bar
    clearInterval(this.startSeekProgressInterval);
  };

  // Handles the chromecast disconnection
  @action
  handleDisconnect = () => {
    this.deviceId = null;
    this.deviceName = null;
    this.channelTitle = null;
    this.imageUrl = null;
    this.streamUrl = null;
    this.isConnected = false;
    this.isDeviceListRecieved = false;
    this.isMediaLoaded = false;
    this.isDisconnected = true;

    clearInterval(this.startSeekProgressInterval);

    // Hide casting player block when disconnected
    this.handleShowCastingPlayerAnimation();
  };

  /**
   * Handles the chromecast button press and opens the overlay
   * with a list of available devices that were detected
   */
  @action
  handleGetChromecastDevicesPress = (videoData) => {

    // Empty list for a re-scan for a new list
    this.deviceList = [];

    /**
     * If video data exists that means that they are
     * currently inside of a video and we want to cast
     * that current video that is being played to
     * google chromecast
     */
    if (videoData.channelId) {
      this.channelTitle = videoData.title;
      this.streamUrl = videoData.streamUrl;
      this.imageUrl = videoData.thumbnailUrl;
    }

    this.isChromecastDeviceListModalOpen = true;

    this.handleScanDevices();
  };

  @action
  handleScanDevices() {
    let availableChromecastDevices;

    this.isDeviceScanInProgress = true;

    Chromecast.getDevices().then((devices) => {
      availableChromecastDevices = devices;
      this.isDeviceScanInProgress = false;
      this.isDeviceListRecieved = true;
      this.deviceList = availableChromecastDevices;
    })
      .catch((error) => {
        console.log(`Cast Error: ${error}`);
      });
  }

  @action
  handleChromecastConfirmationPress = () => {
    this.isChromecastConfirmationModalOpen = true;
  };

  @action
  handleConfirmationOverlayPress = () => {
    this.isChromecastConfirmationModalOpen = false;
  };

  @action
  handleDisconnectPress = () => {
    Chromecast.disconnect();
    this.isChromecastConfirmationModalOpen = false;
  }

  /**
   * Handles the startup of media/video casting we also provide our
   * poster image for the loading screen
   */
  @action
  handleMediaCasting = () => {
    this.handleSeekIntervalProgress();
    const initialVideoStartTimeInSeconds = 0;
    this.isConnected = true;

    // Casting of media
    Chromecast.castMedia(
      this.streamUrl || this.defaultChannelUrl,
      this.channelTitle || this.defaultTitle,
      this.imageUrl || this.defaultImageUrl,
      initialVideoStartTimeInSeconds
    );
  };

  handleSeekIntervalProgress = () => {
    if (this.startSeekProgressInterval === null) {
      this.startSeekProgressInterval();
    }
  };

  /**
   * Handles the google chrome cast connection with the provided
   * device id and name
   */
  @action
  async handleCastConnection(castingData) {

    // Analytics
    AnalyticState.GA.trackScreenView(
      `Chromecast Channel Selected: ${castingData.channelTitle}`
    );

    // Take care of connecting device
    this.isConnecting = true;
    this.isConnected = await Chromecast.isConnected();
    this.isConnecting = false;
    const isSameVideo = (this.defaultTitle === this.channelTitle);

    // Declaring casting data we can use throughout our application
    this.deviceId = castingData.deviceId;
    this.deviceName = castingData.deviceName;
    this.channelTitle = castingData.channelTitle;
    this.streamUrl = castingData.streamUrl;
    this.imageUrl = castingData.imageUrl;

    // When a device is selected, we want to close the device list modal
    this.handleDeviceListModalClose();

    /**
     * If we're connected to google chrome cast then we will
     * continue handling the video/media casting, but if we
     * are not connected then we will attempt to connect
     * again
     */
    if (this.isConnected && !isSameVideo) {
      this.handleMediaCasting(castingData);
    }
    else {
      Chromecast.connectToDevice(castingData.deviceId);
    }
  }

  @action
  handlePauseTogglePress = () => {
    this.isCastingPaused = !this.isCastingPaused;
    Chromecast.togglePauseCast();
  };

  @action
  handleDeviceListModalClose = () => {
    this.isChromecastDeviceListModalOpen = false;
  };

  /**
   * Handles the video controls to be hidden or to be shown with
   * an transitioned animation
   */
  @action
  handleShowCastingPlayerAnimation = () => {
    Animated.spring(
      this.animateCastPlayerValue,
      {
        toValue: this.isConnected ? 0 : 60,
        duration: 0.2
      }
    ).start();
  };

}

export default new ChromecastState();
export { ChromecastState };
