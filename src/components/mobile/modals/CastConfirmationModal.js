import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { Text, TouchableOpacity, View, Modal } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import CastConfirmationTemplate from '../templates/CastConfirmationTemplate';

@inject('ChromecastState') @observer
class CastConfirmationModal extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      modalContainer: {
        position: 'absolute'
      },
      modalOverlayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }
    });
  };

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles();

    return (
      <View style={styles.modalContainer}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={ChromecastState.isChromecastConfirmationModalOpen}
          onRequestClose={() => ChromecastState.handleDeviceListModalClose}
        >
          <TouchableOpacity
            style={styles.modalOverlayContainer}
            onPress={ChromecastState.handleConfirmationOverlayPress}
          >
            <CastConfirmationTemplate />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

}

export default CastConfirmationModal;
