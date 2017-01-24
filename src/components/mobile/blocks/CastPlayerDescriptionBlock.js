import React, { Component } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import CastPlayerTitleTextItem from '../items/CastPlayerTitleTextItem';
import CastPlayerDescriptionTextItem
  from '../items/CastPlayerDescriptionTextItem';

class CastPlayerDescriptionBlock extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      playerDescriptionContainer: {
        flex: 1,
        paddingLeft: 10
      }
    });
  }

  render() {
    const styles = this.createStyles();

    return (
      <View style={styles.playerDescriptionContainer}>
        <CastPlayerTitleTextItem />
        <CastPlayerDescriptionTextItem />
      </View>
    );
  }

}

export default CastPlayerDescriptionBlock;
