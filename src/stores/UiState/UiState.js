import { observable, action } from 'mobx';
import { Dimensions, PixelRatio } from 'react-native';

// User Interface specific state management
class UiState {

  @observable width;
  @observable height;
  @observable orientation;
  @observable isLandscape;
  @observable isPortrait;
  @observable calculatedPlatformRoundedSize;
  @observable x;
  @observable y;

  constructor() {
    const { width, height } = Dimensions.get('window');
    const orientation = (width > height) ? 'landscape' : 'portrait';

    this.handleScreenDensity();

    /**
     * Set initial height and width when application is
     * rendered the first time, so that we avoid the initial
     * UI rendering incorrectly.
     */
    this.handleOrientationUpdate(width, height, orientation, 0, 0);
  }

  // Define Screen density
  handleScreenDensity = () => {
    this.isLowDensity = (PixelRatio.get() === 1 || PixelRatio.get() === 1.5);
    this.isMedDensity = (PixelRatio.get() === 2);
    this.isHighDensity = (PixelRatio.get() >= 3);
  };

  /**
   * Handles updating the current layout properties so that
   * we can style appropriately for certain platforms and
   * orientations
   */
  @action
  handleOrientationUpdate = (width, height, orientation, x, y) => {
    const firstNumberInWidth = Number(width.toString()[0]);
    const firstNumberInHeight = Number(height.toString()[0]);

    this.width = width;
    this.height = height;
    this.orientation = orientation;
    this.isLandscape = orientation === 'landscape';
    this.isPortrait = orientation === 'portrait';
    this.x = x;
    this.y = y;
    this.calculatedPlatformRoundedSize =
      firstNumberInHeight + firstNumberInWidth;
  }

}

export default new UiState();
export { UiState };
