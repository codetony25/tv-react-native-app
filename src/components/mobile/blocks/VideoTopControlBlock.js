import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Animated, TouchableHighlight, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import NavLinkButton from '../buttons/NavLinkButton';
import CastButton from '../buttons/CastButton';

@inject('VideoState', 'UiState') @observer
class VideoTopControlBlock extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    const { UiState, VideoState } = this.props;

    return EStyleSheet.create({
      channelTopNavigation: {
        flexDirection: 'row',
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingLeft: 10,
        paddingTop: UiState.isLandscape ? 10 : 20,
        paddingRight: 10,
        width: UiState.width,
        transform: [{ translateY: VideoState.animateVideoToolbarValue }]
      },
      channelButton: {
        padding: 10
      }
    });
  };

  render() {
    const { VideoState } = this.props;
    const styles = this.createStyles();

    // Channel video data to pass to chromecast.
    const videoData = {
      channelId: VideoState.currentChannelId,
      streamUrl: VideoState.currentVideoStreamUrl,
      title: VideoState.currentVideoTitle,
      thumbnailUrl: VideoState.currentVideoThumbnailUrl
    };

    return (
      <Animated.View style={styles.channelTopNavigation}>
        <NavLinkButton style={styles.channelButton} to="/">
          <Ionicons name="md-arrow-back" size={30} color="white" />
        </NavLinkButton>
        <View style={styles.channelTopRightNavigation}>
          <CastButton
            size={30}
            style={styles.channelButton}
            castData={videoData}
          />
        </View>
      </Animated.View>
    );
  }

}

export default VideoTopControlBlock;
