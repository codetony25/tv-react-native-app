import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';

import NavLinkButton from '../buttons/NavLinkButton';
import ThumbnailImageItem from '../items/ThumbnailImageItem';

@inject('ChromecastState') @observer
class ThumbnailBlock extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      ChromecastState,
      channelId,
      thumbnailUrl,
      title,
      streamUrl
    } = this.props;

    return (
      <NavLinkButton
        to={
          ChromecastState.isConnected ?
            () => {
              (ChromecastState
                .handleCastConnection({
                  deviceId: ChromecastState.deviceId,
                  deviceName: ChromecastState.deviceName,
                  streamUrl,
                  channelTitle: title,
                  imageUrl: thumbnailUrl
                }));
            } : `/channel/${channelId}`
        }
        title={title}
      >
        <ThumbnailImageItem thumbnailImageUrl={thumbnailUrl} />
      </NavLinkButton>
    );
  }

}

export default ThumbnailBlock;
