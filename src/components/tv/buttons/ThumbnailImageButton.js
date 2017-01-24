import React, { PropTypes } from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';

const ThumbnailImageButton = (props) => (
  <TouchableOpacity style={styles.container} onPress={props.select}>
    <Image
      source={{ uri: props.thumb }}
      style={[styles.image, (props.highlighted ? styles.highlighted : {})]}
    />
  </TouchableOpacity>
);

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: width * 0.01,
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'stretch',
    borderRadius: 5,
    width: (width * 0.12 * 1.77),
    height: (width * 0.12),
  },
  highlighted: {
    width: (width * 0.15 * 1.77),
    height: (width * 0.15)
  }
});

export default ThumbnailImageButton;
