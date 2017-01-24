import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { View, Animated } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import VideoSkipButton from '../buttons/VideoSkipButton';

@inject('VideoState', 'UiState', 'ChromecastState') @observer
class VideoBottomControlBlock extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    const { UiState, ChromecastState, VideoState } = this.props;

    // If chromecast is connected then we hide the video controls
    const shouldVideoControlBeShown = ChromecastState.isConnected ?
      140 : VideoState.animateVideoControlValue;

    return EStyleSheet.create({
      channelVideoControlContainer: {
        flexDirection: 'row',
        flex: 1,
        position: 'absolute',
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(80, 0, 0, 0.9)',
        padding: 15,
        width: UiState.width,
        transform: [{ translateY: shouldVideoControlBeShown }],

        /**
         * If there are more than 1 channels then we show the bottom controls
         * we also position it out of view so it's not accidently pressed
         */
        opacity: (VideoState.channelListCount <= 1) ? 0 : 1,
        top: (VideoState.channelListCount <= 1) ? 500 : UiState.height - 80
      },
      channelMediaControlContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
      }
    });
  };

  render() {
    const styles = this.createStyles();

    return (
      <Animated.View style={styles.channelVideoControlContainer}>
        <View style={styles.channelMediaControlContainer}>
          <VideoSkipButton skipType="previous" />
          <VideoSkipButton skipType="next" />
        </View>
      </Animated.View>
    );
  }

}

export default VideoBottomControlBlock;
