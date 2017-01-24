import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('VideoState') @observer
class VideoSkipButton extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      channelButton: {
        padding: 10
      }
    });
  };

  render() {
    const { VideoState, skipType } = this.props;
    const styles = this.createStyles();

    return (
      <TouchableOpacity
        onPress={VideoState.handleNextOrPreviousVideoPress.bind(this, skipType)}
        style={styles.channelButton}
      >
        <MaterialIcons
          name={
            skipType === 'next' ?
              'keyboard-arrow-right' : 'keyboard-arrow-left'
          }
          size={40}
          color="#fff"
        />
      </TouchableOpacity>
    );
  }

}

export default VideoSkipButton;
