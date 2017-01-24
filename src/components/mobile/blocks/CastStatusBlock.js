import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import renderIf from 'render-if';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('ChromecastState') @observer
class CastStatusBlock extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    return EStyleSheet.create({
      modalStatusText: {
        color: '#7a7a7a',
        paddingLeft: 20,
        paddingTop: 8,
        fontSize: 14
      },
      modalStatusTextBold: {
        fontWeight: 'bold'
      }
    });
  };

  render() {
    const { ChromecastState } = this.props;
    const styles = this.createStyles();

    return (
      <View>
        {renderIf(ChromecastState.isMediaLoaded)(
          <Text style={styles.modalStatusText}>
            Now Playing:
          </Text>
        )}
        <Text style={[
          styles.modalStatusText,
          styles.modalStatusTextBold
        ]}
        >
          {(() => {
            if (ChromecastState.isMediaLoaded) {
              return (
                ChromecastState.channelTitle ||
                ChromecastState.defaultTitle
              );
            }
            else {
              return 'Ready to cast from JasminTV';
            }
          })()}
        </Text>
      </View>
    );
  }

}

export default CastStatusBlock;
