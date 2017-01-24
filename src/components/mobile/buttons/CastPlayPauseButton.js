import React, { Component } from 'react';
import renderIf from 'render-if';
import { observer, inject } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('ChromecastState') @observer
class CastPlayPauseButton extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = EStyleSheet.create({
    playerCastButton: {
      paddingRight: 10
    }
  });

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles;

    return (
      <TouchableOpacity
        style={styles.playerCastButton}
        onPress={ChromecastState.handlePauseTogglePress}
      >
        {renderIf(ChromecastState.isMediaLoaded)(
          <Ionicons
            size={25}
            color="#fdc900"
            name={
              ChromecastState.isCastingPaused ? 'md-play' : 'md-pause'
            }
          />
        )}
      </TouchableOpacity>
    );
  }

}

export default CastPlayPauseButton;
