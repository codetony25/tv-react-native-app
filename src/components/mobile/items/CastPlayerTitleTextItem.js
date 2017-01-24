import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('ChromecastState') @observer
class CastPlayerTitleTextItem extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      playerTitleText: {
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 2
      }
    });
  }

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles();

    return (
      <Text style={styles.playerTitleText}>
        {ChromecastState.channelTitle || ChromecastState.defaultTitle}
      </Text>
    );
  }

}

export default CastPlayerTitleTextItem;
