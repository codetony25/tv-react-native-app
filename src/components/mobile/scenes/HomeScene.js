import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Orientation from 'react-native-orientation';
import { View, ScrollView, ActivityIndicator, Platform } from 'react-native';

import ThumbnailBlock from '../blocks/ThumbnailBlock';
import HeaderBlock from '../blocks/HeaderBlock';

@inject('VideoState', 'UiState', 'AnalyticState') @observer
class HomeScene extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { AnalyticState } = this.props;

    // Lock Device Orientation to Portrait if user is on Home screen
    Orientation.lockToPortrait();

    // Analytics
    AnalyticState.GA.trackScreenView('Mobile Home Screen');
    AnalyticState.GTM.pushDataLayerEvent({
      event: 'openScreen',
      screenName: 'Mobile Home Screen'
    }).then((success) => {
      console.log('Google Tag Manager Data Sent', success);
    });
  }

  componentWillUnmount() {

    // When component is unmounted we will unlock for all orientations
    Orientation.unlockAllOrientations();
  }

  createStyles = () => {
    const { UiState, VideoState } = this.props;

    return EStyleSheet.create({
      thumbnailViewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,

        /**
         * If there are more than 4 channels, we show 2 thumbnails at a time
         * per row, if not then we show 1 thumbnail each row
         */
        justifyContent: (VideoState.channelListCount > 4) ?
          'space-between' : 'center',
        alignItems: 'center',
        paddingTop: 4,
        paddingBottom: 70,
        paddingLeft: UiState.width * 0.02,
        paddingRight: UiState.width * 0.02
      },
      centerLoadingIcon: {
        alignItems: 'center',
        flex: 1,
        top: '30%',
        justifyContent: 'center',
        padding: 8
      }
    });
  };

  render() {
    const { VideoState } = this.props;
    const styles = this.createStyles();

    return (
      <View>
        <HeaderBlock />
        <ScrollView>
          <View style={styles.thumbnailViewContainer}>
            {(() => {
              if (VideoState.isChannelApiLoaded) {
                return (
                  VideoState.channelList.map((channel, index) => {
                    return (
                      <ThumbnailBlock
                        key={channel.id}
                        {...channel}
                        channelId={index}
                      />
                    );
                  })
                );
              }
              else {
                return (
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    style={styles.centerLoadingIcon}
                  />
                );
              }
            })()}
          </View>
        </ScrollView>
      </View>
    );
  }

}

export default HomeScene;
