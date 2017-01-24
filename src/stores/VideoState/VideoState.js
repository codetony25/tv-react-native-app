import { observable, action } from 'mobx';
import DeviceInfo from 'react-native-device-info';
import { Platform, Animated } from 'react-native';

import { VIDEO_URL } from '../../config.js';

class VideoState {

  @observable isVideoLoading = false;
  @observable isVideoPaused = false;
  @observable isVideoPlaying = false;
  @observable isChannelApiLoaded = false;
  @observable isVideoError = false;
  @observable isVideoEnd = false;
  @observable isVideoProgress = false;
  @observable currentChannelId = null;
  @observable currentVideoStreamUrl = null;
  @observable currentVideoTitle = null;
  @observable currentVideoThumbnailUrl = null;
  @observable toggleVideoToolbar = false;
  @observable animateVideoToolbarValue = new Animated.Value(0);
  @observable animateVideoControlValue = new Animated.Value(0);
  @observable channelList;
  @observable channelListCount;

  constructor() {

    // Initiate Channel API fetch
    this.handleFetchChannelApi();
  }

  @action
  async handleFetchChannelApi() {

    // We use different JSON data for ios and android
    this.fetchChannelApiUrl = (Platform.OS === 'ios') ?
      VIDEO_URL.mobile.ios :
      VIDEO_URL.mobile.android;

    // If device is Amazon Fire Tablet use amazon fire channel api
    if (
      DeviceInfo.getBrand() === 'Amazon' ||
      DeviceInfo.getBrand() === 'google')
    {
      this.fetchChannelApiUrl = VIDEO_URL.mobile.google;
    }

    try {

      // Begin fetching to channel api
      const response = await fetch(this.fetchChannelApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Retrieve the json response for channel data
      const channelDataResponse = await response.json();
      const { channels } = channelDataResponse;

      // Check to see if there are any channels
      if (!channels || channels.length < 0) {
        throw new Error('No channels are available during fetching.');
      }

      // Set channel data to state
      this.channelList = channels;
      this.channelListCount = channels.length;
      this.currentChannelId = 0;
      this.isChannelApiLoaded = true;
    }
    catch(error) {
      throw new Error('Failed fetching for channels', error);
    }
  }

  @action
  setCurrentChannelId = (channelId) => {
    this.currentChannelId = channelId;
    this.currentVideoStreamUrl = this.channelList[channelId].streamUrl;
    this.currentVideoTitle = this.channelList[channelId].title;
    this.currentVideoThumbnailUrl = this.channelList[channelId].thumbnailUrl;
  };

  @action
  handleVideoEnd = () => {
    this.isVideoPlaying = false;
  };

  @action
  handlePauseAndPlay = () => {
    this.isVideoPaused = !this.isVideoPaused;
  };

  @action
  handleVideoPress = () => {
    this.toggleVideoToolbar = !this.toggleVideoToolbar;
    this.handleVideoControlToggleAnimation();
  };

  @action
  handleVideoLoadStart = () => {
    this.isVideoLoading = true;
    this.isVideoLoaded = false;
  };

  @action
  handleVideoLoad = () => {
    this.isVideoLoading = false;
    this.isVideoLoaded = true;
  };

  @action
  handleVideoError = () => {
    this.isVideoError = true;
  };

  @action
  handleVideoEnd = () => {
    this.isVideoEnd = true;
  };

  @action
  handleVideoProgress = () => {
    this.isVideoProgress = true;
  };

  /**
   * Handles the next and previous button press, depending on
   * what is pressed. It will load the next video stream by
   * changing the video source.
   */
  @action
  handleNextOrPreviousVideoPress = (videoNavigation, event) => {
    this.isVideoLoading = true;

    /**
     * Ensure that the next or previous video is playing when the
     * control buttons are pressed.
     */
    if (this.isVideoPaused) {
      this.isVideoPaused = false;
    }

    // Store as integer value instead of string to calculate appropriately
    let videoId = Number(this.currentChannelId);

    /**
     * If the video id is greater than the channel list count,
     * it will go back to the very first video, if the video
     * is the first in the channel list then it will jump to
     * the last channel list video
     */
    if (videoNavigation === 'next') {
      videoId += 1;
    }
    else if (videoNavigation === 'previous') {
      videoId -= 1;
    }

    if (videoId >= this.channelListCount) {
      videoId = 0;
    }
    else if (videoId <= 0) {
      videoId = this.channelListCount - 1;
    }

    // Keep track of current channel id
    this.currentChannelId = videoId;

    // Set the current video stream url
    this.currentVideoStreamUrl = this.channelList[videoId].streamUrl;
  };

  @action
  setVideoToNull = () => {
    this.currentVideoStreamUrl = null;
    this.currentChannelId = null;
  };

  /**
   * Handles the video controls to be hidden or to be shown with
   * an transitioned animation
   */
  @action
  handleVideoControlToggleAnimation = () => {
    Animated.parallel([
      Animated.spring(
        this.animateVideoToolbarValue,
        {
          toValue: this.toggleVideoToolbar ? -80 : 0,
          duration: 0.2
        }
      ),
      Animated.spring(
        this.animateVideoControlValue,
        {
          toValue: this.toggleVideoToolbar ? 140 : 0,
          duration: 0.2
        }
      )
    ]).start();
  };

}

export default new VideoState();
export { VideoState };
