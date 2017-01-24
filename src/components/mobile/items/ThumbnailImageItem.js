import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

@inject('UiState', 'VideoState') @observer
class ThumbnailImageItem extends Component {

  constructor(props) {
    super(props);
  }

  createStyles = () => {
    const { UiState, VideoState } = this.props;

    /**
     * If there's only 3 channels or less, then we show the full width thumbnail
     * but if not, then we will show 2 thumbnails for each section
     */
    const minimumThumbnailsForTwoColumns = 4;
    const smallerThumbnailSize = 2.15;
    const biggerThumbnailSize = 1.1;
    const sizeToReduceImageBy =
      (VideoState.channelListCount > minimumThumbnailsForTwoColumns)
        ? smallerThumbnailSize : biggerThumbnailSize;

    return EStyleSheet.create({
      thumbnailImage: {
        resizeMode: 'stretch',
        borderRadius: 8,
        '@media ios': {
          shadowColor: 'black',
          shadowOpacity: 0.2,
          shadowOffset: {
            width: 2,
            height: 3
          }
        },

        // Get perfect aspect ratio and divide to make smaller image
        width: UiState.width / sizeToReduceImageBy,
        height: (UiState.width * 9 / 16) / sizeToReduceImageBy,
        marginTop: UiState.isLandscape ?
          UiState.width * 0.013 : UiState.height * 0.014
      }
    });
  };

  render() {
    const { thumbnailImageUrl } = this.props;
    const styles = this.createStyles();

    return (
      <Image
        source={{ uri: thumbnailImageUrl }}
        style={styles.thumbnailImage}
      />
    );
  }

}

export default ThumbnailImageItem;
