import React, { Component } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { Match, MemoryRouter as Router } from 'react-router';
import EStyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react/native';
import SplashScreen from 'react-native-splash-screen';

import HomeScene from './components/mobile/scenes/HomeScene';
import TvHomeScene from './components/tv/scenes/TvHomeScene';
import ChannelScene from './components/mobile/scenes/ChannelScene';
import CastPlayerTemplate from './components/mobile/templates/CastPlayerTemplate';
import CastDeviceListModal
  from './components/mobile/modals/CastDeviceListModal';
import CastConfirmationModal
  from './components/mobile/modals/CastConfirmationModal';

// Build Extended Stylesheet and set global variables here
EStyleSheet.build();

@inject('UiState', 'DeviceState') @observer
class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  createStyle = () => {
    return EStyleSheet.create({
      appContainer: {
        flex: 1,
        backgroundColor: '#4f0103',
        alignItems: 'center',
        justifyContent: 'center'
      }
    });
  };

  render() {
    const { UiState, DeviceState } = this.props;
    const styles = this.createStyle();

    if (DeviceState.isMobile || DeviceState.isAmazonFireTablet) {
      return (
        <Router>
          <View style={styles.appContainer} onLayout={(event) => {

            /**
             * the onLayout property will run everytime the
             * orientation changes, we use this to our advantage
             * to style for specific platforms and orientations.
             */
            const { width, height, x, y } = event.nativeEvent.layout;
            const orientation = (width > height) ? 'landscape' : 'portrait';

            // Store our layout update in current user interface state
            UiState.handleOrientationUpdate(width, height, orientation, x, y);
          }}
          >

            {/* Change status bar text color white instead of default black */}
            <StatusBar
              ranslucent={true}
              barStyle="light-content"
              backgroundColor="#99050e"
            />

            {/* Modals */}
            <CastDeviceListModal />
            <CastConfirmationModal />

            {/* Routes */}
            <Match exactly={true} pattern="/" component={HomeScene} />
            <Match pattern="/channel/:id" component={ChannelScene} />

            {/* Video player on cast connection */}
            <CastPlayerTemplate />
          </View>
        </Router>
      );
    }
    else if (DeviceState.isAmazonFireTv) {
      return <TvHomeScene />;
    }
    else {
      throw new Error('Device is not supported in components - Check App.js');
    }
  }

}

export default App;
