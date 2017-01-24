import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('ChromecastState') @observer
class CastDeviceStatusTextItem extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      modalDeviceCastingText: {
        color: '#7a7a7a',
        paddingLeft: 15,
        fontSize: 25
      },
      modalDeviceScanningText: {
        textAlign: 'center',
        position: 'relative',
        paddingBottom: 28
      }
    });
  };

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles();

    return ChromecastState.isDeviceScanInProgress ? (
        <Text style={[
          styles.modalDeviceNameText,
          styles.modalDeviceScanningText
        ]}
        >
        Scanning for Devices...
      </Text>
    ) : ChromecastState.deviceList.length < 1 && (
      <Text style={[
        styles.modalDeviceNameText,
        styles.modalDeviceScanningText
      ]}
      >
        No Devices Found
      </Text>
    );
  }

}

export default CastDeviceStatusTextItem;
