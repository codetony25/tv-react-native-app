import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('ChromecastState') @observer
class CastDisconnectBlock extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      modalDisconnectButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 20
      },
      modalDisconnectText: {
        color: '#7a7a7a',
        fontSize: 15,
        paddingTop: 10
      }
    });
  };

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles();

    return (
      <View>
        <TouchableOpacity
          style={styles.modalDisconnectButtonContainer}
          onPress={ChromecastState.handleDisconnectPress}
        >
          <Text style={styles.modalDisconnectText}>
            DISCONNECT
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

}

export default CastDisconnectBlock;
