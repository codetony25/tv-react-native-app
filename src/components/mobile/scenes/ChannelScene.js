import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { View,  Text, TouchableWithoutFeedback } from 'react-native';
import Orientation from 'react-native-orientation';
import EStyleSheet from 'react-native-extended-stylesheet';

import VideoBlock from '../blocks/VideoBlock';
import VideoTopControlBlock from '../blocks/VideoTopControlBlock';
import VideoBottomControlBlock from '../blocks/VideoBottomControlBlock';
import HomeScene from '../scenes/HomeScene';

@inject('VideoState', 'ChromecastState', 'UiState', 'AnalyticState') @observer
class ChannelScene extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { AnalyticState, VideoState } = this.props;

    VideoState.setVideoToNull();

    Orientation.unlockAllOrientations();

    // Analytics
    AnalyticState.GA.trackScreenView('Mobile Channel Screen');
    AnalyticState.GTM.pushDataLayerEvent({
      event: 'openScreen',
      screenName: 'Mobile Channel Screen'
    }).then((success) => {
      console.log('Google Tag Manager Data Sent', success);
    });
  }

  createStyle = () => {
    const { UiState } = this.props;

    return EStyleSheet.create({
      channelContainer: {
        flex: 1,
        backgroundColor: 'black',
        width: UiState.width,
        height: UiState.height,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      channelVideoContainer: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }
    });
  };

  render() {
    const { params, VideoState, ChromecastState } = this.props;
    const styles = this.createStyle();

    // If the current channel id isn't initially set yet, then we we set it
    if (!VideoState.currentChannelId) {
      VideoState.setCurrentChannelId(params.id);
    }

    /**
     * If Chromecast is connected then we want the user to be able to go
     * back to the HomeScene so that they can select different channels
     * to cast.
     *
     * If chromecast is disconnected we also want to make sure that it
     * directs back to the HomeScene
     */
    return !ChromecastState.isConnected && ChromecastState.isDisconnected ? (
      <View style={styles.channelContainer}>
        <TouchableWithoutFeedback onPress={VideoState.handleVideoPress}>
          <View style={styles.channelVideoContainer}>
            <VideoBlock />
          </View>
        </TouchableWithoutFeedback>
        <VideoTopControlBlock />
        <VideoBottomControlBlock />
      </View>
    ) : <HomeScene />;
  }

}

export default ChannelScene;
