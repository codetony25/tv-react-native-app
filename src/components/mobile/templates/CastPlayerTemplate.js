import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, Animated } from 'react-native';

import CastPlayPauseButton from '../buttons/CastPlayPauseButton';
import CastPlayerDescriptionBlock from '../blocks/CastPlayerDescriptionBlock';
import CastPlayerImageItem from '../items/CastPlayerImageItem';
import CastSeekProgressBarBlock from '../blocks/CastSeekProgressBarBlock';

@inject('UiState', 'ChromecastState') @observer
class CastPlayerTemplate extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    const { UiState, ChromecastState } = this.props;

    return EStyleSheet.create({
      playerContainer: {
        backgroundColor: '#500000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 68,
        width: UiState.width,
        transform: [{ translateY: ChromecastState.animateCastPlayerValue }],
        opacity: ChromecastState.isConnected ? 1 : 0
      },
      playerImage: {
        resizeMode: 'contain',
        width: 84,
        height: 84
      }
    });
  };

  render() {
    const styles = this.createStyles();

    return (
      <Animated.View style={styles.playerContainer}>
        <CastSeekProgressBarBlock />
        <CastPlayerImageItem />
        <CastPlayerDescriptionBlock />
        <CastPlayPauseButton />
      </Animated.View>
    );
  }

}

export default CastPlayerTemplate;
