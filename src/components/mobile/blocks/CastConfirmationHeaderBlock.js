import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('ChromecastState') @observer
class CastConfirmationHeaderBlock extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      modalHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
      },
      modalTitleText: {
        fontSize: 14,
        flex: 1,
        fontWeight: 'bold',
        paddingTop: 9,
        paddingBottom: 8,
        alignSelf: 'flex-start',
        color: '#3c3c3c'
      },
      modalIcon: {
        paddingTop: 6,
        paddingLeft: 10,
        paddingRight: 10
      }
    });
  };

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles();

    return (
      <View style={styles.modalHeaderContainer}>
        <MaterialIcons
          name="cast"
          size={32}
          color="#9e9e9e"
          style={styles.modalIcon}
        />
        <Text style={styles.modalTitleText}>
          {ChromecastState.deviceName}
        </Text>
      </View>
    );
  }

}

export default CastConfirmationHeaderBlock;
