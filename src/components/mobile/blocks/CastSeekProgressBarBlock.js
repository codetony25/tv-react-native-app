import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('ChromecastState', 'UiState') @observer
class CastSeekProgressBarBlock extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    const { UiState, ChromecastState } = this.props;

    return EStyleSheet.create({
      progressBarContainer: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        width: UiState.width,
        overflow: 'hidden',
        height: 4
      },
      progressBarLeft: {
        backgroundColor: '#fdc900',
        flex: ChromecastState.isMediaLoaded ?
          100 : ChromecastState.castSeekProgress
      },
      progressBarRight: {
        backgroundColor: '#9b7272',
        flex: ChromecastState.isMediaLoaded ?
          0 : (100 - ChromecastState.castSeekProgress)
      }
    });
  };

  render() {
    const styles = this.createStyles();

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarLeft} />
        <View style={styles.progressBarRight} />
      </View>
    );
  }

}

export default CastSeekProgressBarBlock;
