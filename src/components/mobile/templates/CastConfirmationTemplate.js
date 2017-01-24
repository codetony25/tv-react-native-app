import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import CastStatusBlock from '../blocks/CastStatusBlock';
import CastDisconnectBlock from '../blocks/CastDisconnectBlock';
import CastConfirmationHeaderBlock from '../blocks/CastConfirmationHeaderBlock';

@inject('UiState') @observer
class CastConfirmationTemplate extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    const { UiState } = this.props;

    return EStyleSheet.create({
      modalViewContainer: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#979797',
        backgroundColor: 'white',
        position: 'absolute',
        alignSelf: 'center',
        top: 0,
        left: UiState.width / 9,
        width: UiState.width / 1.3,
        marginTop: UiState.height / 3,
        '@media ios': {
          shadowColor: 'black',
          shadowOffset: { width: 10, height: 10 },
          shadowOpacity: 0.2
        }
      }
    });
  };

  render() {
    const styles = this.createStyles();

    return (
      <View style={styles.modalViewContainer}>
        <CastConfirmationHeaderBlock />
        <CastStatusBlock />
        <CastDisconnectBlock />
      </View>
    );
  }

}

export default CastConfirmationTemplate;
