import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import SplashScreen from 'react-native-splash-screen';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
  ScrollView,
  TextInput,
  UIManager,
  LayoutAnimation,
  BackAndroid,
  ActivityIndicator,
  AppState,
  TouchableHighlight,
  Animated
} from 'react-native';

import ThumbnailImageButton from '../buttons/ThumbnailImageButton';
import KeyEvent from 'react-native-keyevent';
import Video from 'react-native-video';
import KeepAwake from 'react-native-keep-awake';
import ImageCacheItem from '../items/ImageCacheItem';
import { VIDEO_URL } from '../../../config';

const FETCH_API = VIDEO_URL.tv.amazon;

// Set to play videos automatically
const AUTO_PLAY_VIDEOS = true;

const CustomLayoutLinear = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  }
};

@inject('AnalyticState') @observer
class TvHomeScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: null,
      highlighted: null,
      playing: false,
      buffering: null,
      loading: false,
      paused: false,
      hidden: false,
      restart: false,
      backgrounded: false,
      error: null,
      fadeBackground: new Animated.Value(1),
      showBackground: true
    }
  }

  fetchData(retries = 0) {

    // Clear errors
    this.setState({error: null});

    // Fetch data
    fetch(FETCH_API, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.channels || !(response.channels.length > 0)) {
          throw new Error('No Channels Available');
        }

        this.setState({
          channels: response.channels,
          highlighted: 0,
          buffering: null,
          paused: true
        }, () => {

          // Wait 4 + 4 = 8 seconds before first autoplay
          setTimeout(() => {
            this.checkTimeouts();
          }, 4000);
        });
      })
      .catch((error) => {
        console.log('Fetch Error', error, retries);

        if (retries > 10) {
          LayoutAnimation.configureNext(CustomLayoutLinear);
          this.setState({error: error});
        } else {
          this.fetchData(retries + 1); // Retry
        }
      });
  }

  playHightlighted() {
    const { AnalyticState } = this.props;

    clearTimeout(this.timeoutBuffer);

    // Analytics
    AnalyticState.GA.trackScreenView(
      `TV - Channel Selected: ${
        this.state.channels[this.state.highlighted].title
      }`
    );

    // Fade background out
    Animated.timing(
      this.state.fadeBackground,
      { toValue: 0, duration: 200 }).start();

    LayoutAnimation.configureNext(CustomLayoutLinear);
    this.setState({
      hidden: true,
      buffering: this.state.highlighted,
      playing: true,
      paused: false,
      showBackground: false
    });
  }

  stopVideo() {
    clearTimeout(this.timeoutBuffer);

    // Fade background in
    Animated.timing(
      this.state.fadeBackground,
      { toValue: 1, duration: 200 }).start();
    LayoutAnimation.configureNext(CustomLayoutLinear);
    this.setState({
      playing: false,
      hidden: false,
      showBackground: true
    });
  }

  restartVideo() {

    // Reset the video player
    clearTimeout(this.timeoutBuffer);

    this.setState({
      restart: true,
      loading: true
    }, () => this.setState({ restart: false }));
  }

  changeVideo(newHighlighted) {

    clearTimeout(this.timeoutBuffer);
    if (!this.state.showBackground) {

      // Fade in background
      Animated.timing(
        this.state.fadeBackground,
        { toValue: 1, duration: 200 }).start();
    }

    LayoutAnimation.configureNext(CustomLayoutLinear);

    this.setState({
      hidden: false,
      highlighted: newHighlighted,
      playing: false,
      showBackground: true
    });

    this.timeoutBuffer = setTimeout(() => {

      // Start buffering video if video is highlighted for more then 1 second
      this.setState({ buffering: this.state.highlighted });
    }, 1000);
  }

  checkTimeouts() {
    clearTimeout(this.timeout);

    if (this.state.playing && !this.state.hidden) {

      // Hide menu after timeout
      this.timeout = setTimeout(() => {
        if (this.state.playing && !this.state.hidden) {
          LayoutAnimation.configureNext(CustomLayoutLinear);
          this.setState({hidden: true});
        }
      }, 3000);
    }
    else if (!this.state.playing && this.state.highlighted !== null) {

      // Auto play after 4 seconds
      this.timeout = setTimeout(() => {
        if (!this.state.playing && this.state.highlighted !== null) {
          AUTO_PLAY_VIDEOS && this.playHightlighted();
        }
      }, 4000);
    }
  }

  _handleAppStateChange(currentAppState) {
    if (currentAppState === 'background') {

      // App is backgrounded
      this.setState({ backgrounded: true });
    }
    else if (currentAppState === 'active') {

      this.setState({ backgrounded: false });

      if (this.state.playing) {
        this.restartVideo();
      }
    }
    else if (currentAppState === 'inactive') {
      // App is being backgrounded

    }
  }

  componentWillUnmount() {
    KeyEvent.removeKeyDownListener();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidMount() {

    // Analytics
    const { AnalyticState } = this.props;

    AnalyticState.GA.trackScreenView('TV Home Screen');
    AnalyticState.GTM.pushDataLayerEvent({
      event: 'openScreen',
      screenName: 'TV Home Screen'
    }).then((success) => {
      console.log('Google Tag Manager Data Sent', success);
    })

    KeepAwake.activate();

    SplashScreen.hide();

    // Enable animations
    (UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true));

    AppState.addEventListener('change', this._handleAppStateChange.bind(this));

    BackAndroid && BackAndroid.addEventListener('hardwareBackPress', () => {
      this.stopVideo();
      return true;
    });

    this.fetchData();

    const thumbWidth = (width * 0.12 * 1.77) + (width * 0.01 * 2);

    this.scrollView = null;

    KeyEvent.onKeyDownListener((keyCode) => {
      const {
        highlighted,
        hidden,
        channels,
        error,
        playing,
        paused,
        buffering
      } = this.state;

      if (!this.scrollView) {
        this.scrollView = this.refs.scrollView;
      }

      if (keyCode === 21) { // Left key

        if (hidden) {

          // Show menu first
          LayoutAnimation.configureNext(CustomLayoutLinear);
          this.setState({ hidden: false });
        }
        else if (channels) {

          // Scroll left on menu
          let newHighlighted = highlighted;

          if (highlighted > 0) {
            newHighlighted = highlighted - 1;

            this.scrollView && this.scrollView.scrollTo({
              x: (newHighlighted * thumbWidth),
              y: 0,
              animated: true,
            });

            this.changeVideo(newHighlighted);
          }
        }
      }
      else if (keyCode === 22) { // Right
        if (hidden) {

          // Show menu first
          LayoutAnimation.configureNext(CustomLayoutLinear);
          this.setState({ hidden: false });
        }
        else if (channels) {

          // Scroll right on menu
          let newHighlighted = highlighted;

          if (highlighted < (channels.length - 1)) {
            newHighlighted = highlighted + 1;

            this.scrollView && this.scrollView.scrollTo({
              x: (newHighlighted * thumbWidth),
              y: 0,
              animated: true,
            });

            this.changeVideo(newHighlighted);
          }
        }
      }
      else if (keyCode === 19) { // Up
        LayoutAnimation.configureNext(CustomLayoutLinear);
        this.setState({ hidden: false });
      }
      else if (keyCode === 20) { // Down
        if (hidden) {

          // Show menu
          LayoutAnimation.configureNext(CustomLayoutLinear);
          this.setState({ hidden: false });
        }
        else if (playing) {

          // Hide menu only if video is playing
          LayoutAnimation.configureNext(CustomLayoutLinear);
          this.setState({ hidden: true });
        }
      }
      else if (keyCode === 23) { // Enter key
        if (error) {
          this.fetchData(); // Retry
        }
        else if (!hidden) {

          // Play channel
          this.playHightlighted();
        }
        else {
          LayoutAnimation.configureNext(CustomLayoutLinear);
          this.setState({ hidden: !hidden });
        }
      }
      else if (keyCode === 4) { // Escape (Back button)
        this.stopVideo();
      }
      else if (keyCode === 85) { // Play/Pause button
        if (playing) {
          this.setState({ paused: !paused }); // Flip pause
        }
        else {

          // Play channel
          this.playHightlighted();
        }
      }
      else if (keyCode === 82) {

        // Menu button
        LayoutAnimation.configureNext(CustomLayoutLinear);
        this.setState({ hidden: false });
      }

      // Check for timeout events
      setTimeout(() => this.checkTimeouts(), 10);
    });
  }

  render() {
    const {
      highlighted,
      hidden,
      channels,
      playing,
      error,
      paused,
      loading,
      backgrounded,
      restart,
      buffering
    } = this.state;

    if (error) {
      return (
        <View style={styles.loading}>
          <Text style={styles.errorHeader}>Something Went Wrong</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <TouchableHighlight
            style={styles.retryButton}
            onPress={() => this.fetchData()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView ref="remoteControlHack" style={{position: 'absolute'}} />
        { !backgrounded && buffering !== null && !restart &&
        <Video
          source={{uri: channels[buffering].streamUrl}}
          rate={1.0}
          volume={1.0}
          muted={(playing ? false : true)}
          paused={paused}
          repeat={false}
          resizeMode="contain"
          playInBackground={false}
          playWhenInactive={false}
          onLoadStart={(param) => {
            this.setState({loading: true});
          }}
          onLoad={(param) => {
            this.lastTime = 0;
            this.freezeCount = 0;
            this.setState({loading: false})
          }}
          onProgress={(param) => {
            if (param.currentTime < this.lastTime) {

              // Reset video. Otherwise the next video does not play
              console.log('Reloading video...');
              this.restartVideo();
            }
            else if (this.freezeCount > 8) {

              // Video has not progressed. Restart video
              console.log('Video halted. Restarting...');
              this.restartVideo();
            }
            else if (!paused && param.currentTime === this.lastTime) {
              this.freezeCount++;
            }
            else {
              this.freezeCount = 0;
              this.lastTime = param.currentTime;
            }
          }}
          onEnd={(param) => this.stopVideo()}
          onError={(error) => {
            console.log('Video Error', error);
            this.restartVideo();
          }}
          style={styles.backgroundVideo}
        />
        }

        {loading &&
        <View style={styles.loading}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#FFF"
          />
        </View>
        }

        { channels &&
        <Animated.View
          style={[styles.background, {opacity: this.state.fadeBackground}]}
        >
          <ImageCacheItem
            style={styles.background}
            source={{uri: channels[highlighted].backgroundImageUrl}}
            resizeMode="stretch"
          />
          <View style={styles.backgroundRow}>
            <View style={styles.backgroundBlack} />
            <Image
              style={styles.backgroundShadow}
              source={require('../../../public/images/shadow-bg.png')}
            />
          </View>
          <View style={styles.column}>
            <Image
              style={styles.header}
              source={require('../../../public/images/header-logo-3x.png')}
            />
            <ImageCacheItem
              style={styles.backgroundLogo}
              source={{uri: channels[highlighted].backgroundLogoUrl}}
              resizeMode="contain"
            />
            <Text
              style={styles.channelDescription}
            >
              {channels[highlighted].description}
            </Text>
          </View>
        </Animated.View>
        }

        { channels &&
        <ScrollView
          ref="scrollView"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={[styles.scrollView, (hidden ? styles.scrollViewHidden : {})]}
        >
          <View style={{width: 30}} />
          { channels.map((channel, index) => {
            return (
              <ThumbnailImageButton
                key={index}
                thumb={channel.thumbnailUrl}
                highlighted={(highlighted === index)}
                select={() => this.setState({highlighted: index})}
              />
            );
          })}
          <View style={{width: 30}} />
        </ScrollView>
        }
      </View>
    );
  }
}

// Used to scale to different TV sizes
const RELATIVE_SCALE = 540;

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },

  // Channel information
  background: {
    position: 'absolute',
    backgroundColor: 'black',
    top: 0,
    left: 0,
    width,
    height
  },
  backgroundRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: (width * 0.6),
    height,
    flexDirection: 'row'
  },
  backgroundBlack: {
    flex: 1,
    backgroundColor: 'black'
  },
  backgroundShadow: {
    height
  },
  column: {
    flexDirection: 'column',
    position: 'absolute',
    top: (width * 0.05),
    left: (width * 0.05),

    width: (width * 0.4)
  },
  header: {
    width: (height * 149/RELATIVE_SCALE),
    height: (height * 25/RELATIVE_SCALE),
    resizeMode: 'contain',
    left: 0,
    marginBottom: (height * 30/RELATIVE_SCALE)
  },
  backgroundLogo: {
    width: (width * 0.3),
    height: (height * 0.3),
    marginBottom: (height * 6/RELATIVE_SCALE)
  },
  channelDescription: {
    color: 'white',
    fontSize: (height * 18/RELATIVE_SCALE),
    height
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  scrollView: {
    left: 0,
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row'
  },
  scrollViewHidden: {
    bottom: -((width * 0.15) + (width * 0.01 * 2) - 1)
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorHeader: {
    color: 'white',
    fontSize: (height * 28 / RELATIVE_SCALE)
  },
  errorMessage: {
    margin: (height * 20 / RELATIVE_SCALE),
    color: 'white',
    fontSize: (height * 16 / RELATIVE_SCALE)
  },
  retryButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: (height * 20 / RELATIVE_SCALE)
  },
  retryButtonText: {
    paddingLeft: (height * 40 / RELATIVE_SCALE),
    paddingRight: (height * 40 / RELATIVE_SCALE),
    paddingTop: (height * 10 / RELATIVE_SCALE),
    paddingBottom: (height * 10 / RELATIVE_SCALE),
    color: 'white',
    fontSize: (height * 16 / RELATIVE_SCALE)
  }
});

export default TvHomeScene;
