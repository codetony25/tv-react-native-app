import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { View, Image, PixelRatio, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import CastButton from '../buttons/CastButton';

@inject('UiState') @observer
class HeaderBlock extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    const { UiState } = this.props;

    return EStyleSheet.create({
      headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 45,
        paddingLeft: 15,
        paddingRight: 15,
        width: UiState.width,
        '@media ios': {
          paddingTop: 20,
          height: 70,
          shadowColor: 'black',
          shadowOpacity: 0.2,
          shadowOffset: {
            width: 2,
            height: 3
          }
        }
      },
      headerImage: {
        resizeMode: 'contain',
        width: 155
      },
      headerCastButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 6
      }
    });
  };

  render() {
    const { UiState } = this.props;
    const styles = this.createStyles();

    let headerLogoUrl = require('../../../public/images/header-logo.png');

    if (UiState.isMedDensity) {
      headerLogoUrl = require('../../../public/images/header-logo-2x.png');
    }
    else if (UiState.isHighDensity) {
      headerLogoUrl = require('../../../public/images/header-logo-3x.png');
    }

    return (
      <LinearGradient
        colors={['#b80000', '#af232D', '#a00000']}
        style={styles.headerContainer}
      >
        <Image
          style={styles.headerImage}
          source={headerLogoUrl}
        />
        <CastButton />
      </LinearGradient>
    );
  }

}

export default HeaderBlock;
