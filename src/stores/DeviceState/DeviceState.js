import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

import { SETTINGS } from '../../config';

// Device specific information state management
class DeviceState {

  constructor() {
    this.handleDeviceInit();

    // Enable logging to show device information
    if (SETTINGS.isDeviceInfoLogging) {
      this.handleDeviceInfoLogging();
    }
  }

  handleDeviceInit = () => {
    this.brand = DeviceInfo.getBrand();
    this.manufacturer = DeviceInfo.getManufacturer();
    this.model = DeviceInfo.getModel();
    this.id = DeviceInfo.getDeviceId();
    this.systemName = DeviceInfo.getSystemName();
    this.deviceName = DeviceInfo.getDeviceName();
    this.country = DeviceInfo.getDeviceCountry();
    this.timezone = DeviceInfo.getTimezone();
    this.isEmulator = DeviceInfo.isEmulator();
    this.isTablet = DeviceInfo.isTablet();
    this.isAmazonFireTv = this.model.includes('AFT');
    this.isAmazonFireTablet = this.model === 'KFASWI';
    this.isNexus = this.model.includes('Nexus');
    this.isIOS = Platform.OS === 'ios';
    this.isAndroid = Platform.OS === 'android';
    this.isAndroidMobile = this.isAndroid && !this.isAmazonFireTv;
    this.isTvOS = Platform.OS === 'tvos';
    this.isMobile = this.isIOS || (this.isAndroid && !this.isAmazonFireTv);
  }

  handleDeviceInfoLogging = () => {
    console.log("Device Manufacturer", DeviceInfo.getManufacturer());
    console.log("Device Brand", DeviceInfo.getBrand());
    console.log("Device Model", DeviceInfo.getModel());
    console.log("Device ID", DeviceInfo.getDeviceId());
    console.log("System Name", DeviceInfo.getSystemName());
    console.log("System Version", DeviceInfo.getSystemVersion());
    console.log("Device Name", DeviceInfo.getDeviceName());
    console.log("User Agent", DeviceInfo.getUserAgent());
    console.log("Device Country", DeviceInfo.getDeviceCountry());
    console.log("Timezone", DeviceInfo.getTimezone());
    console.log("App is running on a tablet", DeviceInfo.isTablet());
  }

}

export default new DeviceState();
export { DeviceState };
