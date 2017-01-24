import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('ChromecastState') @observer
class CastButton extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      headerCastButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 6,
        backgroundColor: 'transparent'
      }
    });
  }

  render() {
    const { ChromecastState, castData } = this.props;
    const styles = this.createStyles();
    let handleDevicePress = ChromecastState.handleGetChromecastDevicesPress;

    /**
     * If casting data is provided we will make sure
     * to pass it along to our store on press
     */
    if (castData) {
      handleDevicePress =
        ChromecastState.handleGetChromecastDevicesPress.bind(this, castData);
    }

    return (
      <TouchableOpacity
        style={[styles.headerCastButton, this.props.style || null]}
        onPress={
          ChromecastState.isConnected ?
            ChromecastState.handleChromecastConfirmationPress :
            handleDevicePress
        }
      >
        <MaterialIcons
          name={ChromecastState.isConnected ? 'cast-connected' : 'cast'}
          size={this.props.size || 26}
          color={ChromecastState.isConnected ? '#fdc900' : 'white'}
        />
      </TouchableOpacity>
    );
  }

}

export default CastButton;
