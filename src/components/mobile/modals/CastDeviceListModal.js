import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import renderIf from 'render-if';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Text, TouchableOpacity, View, Modal } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import CastDeviceStatusTextItem from '../items/CastDeviceStatusTextItem';

@inject('UiState', 'ChromecastState') @observer
class CastDeviceListModal extends Component {

  constructor(props, context) {
    super(props, context);
  }

  createStyles = () => {
    const { UiState } = this.props;

    return EStyleSheet.create({
      modalContainer: {
        position: 'absolute'
      },
      modalViewContainer: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#979797',
        backgroundColor: 'white',
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        top: 0,
        left: UiState.width / 9,
        width: UiState.width / 1.3,
        marginTop: UiState.height / 3,
        '@media ios': {
          shadowColor: 'black',
          shadowOffset: { width: 10, height: 10 },
          shadowOpacity: 0.2
        }
      },
      modalTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 15,
        paddingLeft: 15,
        paddingBottom: 8,
        color: '#3c3c3c'
      },
      modalIcon: {
        paddingTop: 6,
        paddingRight: 8
      },
      modalDeviceTextContainer: {
        flex: 1
      },
      modalOverlayContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      },
      modalDeviceButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        position: 'relative',
        flex: 1
      },
      modalDeviceNameText: {
        color: '#3c3c3c',
        fontWeight: 'bold',
        paddingLeft: 15,
        paddingBottom: 5,
        fontSize: 14
      },
      modalDeviceCastingText: {
        color: '#7a7a7a',
        paddingLeft: 15,
        fontSize: 12
      },
      modalDeviceScanningText: {
        textAlign: 'center',
        position: 'relative'
      }
    });
  };

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles();
    const ifDevicesAreAvailable =
      renderIf(ChromecastState.isDeviceListRecieved);

    return (
      <View style={styles.modalContainer}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={ChromecastState.isChromecastDeviceListModalOpen}
          onRequestClose={() => ChromecastState.handleDeviceListModalClose}
        >
          <TouchableOpacity
            style={styles.modalOverlayContainer}
            onPress={ChromecastState.handleDeviceListModalClose}
          >
            <View style={styles.modalViewContainer}>
              <Text style={styles.modalTitleText}>Cast to</Text>
              {ifDevicesAreAvailable(
                ChromecastState.deviceList.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.modalDeviceButton, {

                      // For even blocks we add a lightgray background
                      backgroundColor: (index % 2 === 0) ?
                        '#fff' : '#ebebeb'
                    }]}
                    onPress={() => {
                      ChromecastState
                        .handleCastConnection({
                          deviceId: item.id,
                          deviceName: item.name,
                          channelTitle:
                            ChromecastState.channelTitle ||
                            ChromecastState.defaultTitle,
                          streamUrl:
                            ChromecastState.streamUrl ||
                            ChromecastState.defaultChannelUrl,
                          imageUrl:
                            ChromecastState.imageUrl ||
                            ChromecastState.defaultImage
                        });
                    }}
                  >
                    <MaterialIcons
                      name="tv"
                      size={26}
                      color="#9e9e9e"
                      style={styles.modalIcon}
                    />
                    <View style={styles.modalDeviceTextContainer}>
                      <Text style={styles.modalDeviceNameText}>
                        {item.name}
                      </Text>
                      <Text style={styles.modalDeviceCastingText}>
                        Casting {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              ))}
              <CastDeviceStatusTextItem />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

}

export default CastDeviceListModal;
