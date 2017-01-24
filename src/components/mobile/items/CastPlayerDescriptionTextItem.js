import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('ChromecastState') @observer
class CastPlayerDescriptionTextItem extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      playerDescriptionText: {
        color: 'white',
        fontSize: 12
      }
    });
  };

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles();

    return (
      <Text style={styles.playerDescriptionText}>
        {
          ChromecastState.isMediaLoaded ?
            `Casting to ${ChromecastState.deviceName}` :
            `Connecting to ${ChromecastState.deviceName}...`
        }
      </Text>
    );
  }

}

export default CastPlayerDescriptionTextItem;
