import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import Video from 'react-native-video';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  View,
  Image,
  Platform,
  ActivityIndicator,
  AppState
} from 'react-native';

@inject('VideoState', 'ChromecastState', 'UiState', 'AnalyticState') @observer
class VideoBlock extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    resizeMode: 'contain',
    isMuted: false
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (currentAppState) => {
    if(currentAppState == "background") {
      this.setState({ isMuted: true });
    }
    if(currentAppState == "active") {
      this.setState({ isMuted: false });
    }
  };

  createStyles = () => {
    const { UiState } = this.props;

    return EStyleSheet.create({
      videoPlayer: {
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      videoLoadingContainer: {
        backgroundColor: 'black',
        position: 'absolute',
        width: UiState.width,
        height: UiState.height,
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0
      },
      videoCastImage: {
        width: UiState.width,
        height: UiState.height
      }
    });
  };

  onLayout = () => {
    const { UiState } = this.props;

    if (UiState.isLandscape) {
      this.setState({ resizeMode: 'stretch' });
    } else {
      this.setState({ resizeMode: 'contain' });
    }
  };

  render() {
    const { VideoState, ChromecastState, UiState, AnalyticState } = this.props;
    const styles = this.createStyles();

    // Analytics
    AnalyticState.GA.trackScreenView(
      `Mobile - Channel Selected: ${VideoState.currentVideoTitle}`
    );

    if (!ChromecastState.isConnected) {
      return (
        <View style={[styles.videoPlayer, UiState.isLandscape ? {
          width: UiState.width,
          height: (UiState.width * 9 / 16),
        } : {
          position: 'absolute'
        }]}
        >
          <Video
            ref={(ref) => {
              this.player = ref;
            }}
            onLayout={this.onLayout}
            source={{ uri: VideoState.currentVideoStreamUrl }}
            muted={this.state.isMuted}
            fullscreen={false}
            rate={1.0}
            repeat={true}
            volume={1.0}
            paused={VideoState.isVideoPaused || ChromecastState.isConnected}
            playWhenInactive={true}
            playInBackground={true}
            onLoadStart={() => VideoState.handleVideoLoadStart()}
            onLoad={(params) => VideoState.handleVideoLoad(params)}
            onError={() => VideoState.handleVideoError()}
            onEnd={VideoState.handleVideoEnd}
            onProgress={VideoState.handleVideoProgress}
            resizeMode={this.state.resizeMode}
            style={[styles.videoPlayer, UiState.isLandscape ? {
              width: UiState.width,
              height: (UiState.width * 9 / 16),
            } : {
              position: 'absolute'
            }]}
          />
          {(() => {

            /**
             * TODO: Remove The Platform.OS === 'ios' once library is
             * fixed for react-native-video
             */
            if (VideoState.isVideoLoading && Platform.OS !== 'ios') {
              return (
                <View style={styles.videoLoadingContainer}>
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    color="#fff"
                  />
                </View>
              );
            }
            else {
              return null;
            }
          })()}
        </View>
      );
    }
    else {
      return (
        <View>
          <Image
            source={{ uri: VideoState.currentVideoThumbnailUrl }}
            resizeMode={'contain'}
            style={styles.videoCastImage}
          />
        </View>
      );
    }
  }

}

export default VideoBlock;
