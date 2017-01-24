import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Image } from 'react-native';

@inject('ChromecastState') @observer
class CastPlayerImageItem extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      playerImage: {
        resizeMode: 'contain',
        width: 84,
        height: 84
      }
    });
  };

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles();

    return (
      <Image
        style={styles.playerImage}
        source={{
          uri: ChromecastState.imageUrl || ChromecastState.defaultImageUrl
        }}
      />
    );
  }

}

export default CastPlayerImageItem;
