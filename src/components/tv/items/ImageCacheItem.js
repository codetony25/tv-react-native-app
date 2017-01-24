import React, { PropTypes } from 'react';
import { Image, View } from 'react-native';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';

const SHA1 = require('crypto-js/sha1');
const URL = require('url-parse');

class ImageCacheItem extends React.Component {

  static propTypes = {
    source: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.loadImage = this.loadImage.bind(this);
    this.cacheImage = this.cacheImage.bind(this);

    this.state = {
      imageUri: null,
      cachedImagePath: null,
      checking: false,
      previousFiles: {},
    };
  }

  componentWillMount() {
    if (this.props.source.uri) {
      this.loadImage(this.props.source.uri);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.source.uri) {
      // Remove image
      this.setState({
        imageUri: null,
        cachedImagePath: null,
        checking: false
      });
    }
    else if (nextProps.source.uri !== this.props.source.uri) {
      this.loadImage(nextProps.source.uri);
    }
    else {
      // No change
    }
  }

  loadImage(imageUri) {
    const { previousFiles } = this.state;
    if (previousFiles[imageUri]) {

      // We already know the cached file
      this.setState({
        imageUri,
        cachedImagePath: `file://${previousFiles[imageUri]}`,
        checking: false
      });

      return;
    }

    const url = new URL(imageUri);
    const type = url.pathname && url.pathname.replace(/.*\.(.*)/, '$1');
    const cacheKey = `${SHA1(url.pathname)}.${type}`;

    // const dirPath = DocumentDirectoryPath+'/'+url.host;
    const dirPath = DocumentDirectoryPath;
    const filePath = `${dirPath}/${cacheKey}`;

    this.setState({checking: imageUri, cachedImagePath: null, imageUri: null});

    RNFS
      .stat(filePath)
      .then((res) => {
        if (res.isFile()) {

          // means file exists, ie, cache-hit
          console.log('Cache hit');

          const { previousFiles } = this.state;
          previousFiles[imageUri] = filePath;
          if (this.state.checking === imageUri) {
            this.setState({
              imageUri,
              cachedImagePath: `file://${filePath}`,
              checking: false,
              previousFiles
            });
          }
          else {
            this.setState({ previousFiles });
          }
        }
        else {
          throw new Error('Cache miss');
        }
      })
      .catch((err) => {
        console.log('Cache miss');
        if (this.state.checking === imageUri) {

          // Load image from network while we start caching
          this.setState({
            imageUri,
            cachedImagePath: null,
            checking: false
          });
        }

        // Start caching image
        this.cacheImage(imageUri, dirPath, filePath);
      });
  }

  cacheImage(imageUri, dirPath, filePath) {
    const ret = RNFS.downloadFile({
      fromUrl: imageUri,
      toFile: filePath,
      background: true
    });

    ret.promise.then(() => {
      const { previousFiles } = this.state;
      console.log('Cached image', filePath);

      // Save file path
      previousFiles[imageUri] = filePath;

      this.setState({ previousFiles });
    })
      .catch((err) => {
        console.log('Error image cache', err.message);
      });
  }

  render() {
    const { cachedImagePath, imageUri, checking } = this.state;
    const uri = cachedImagePath || imageUri;
    const source = (!checking && uri) ?
      { uri } : require('../../../public/images/transparent.png');

    return (
      <Image {...this.props} source={source}>
        {this.props.children}
      </Image>
    );
  }

}

export default ImageCacheItem;
