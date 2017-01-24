import React, { Component } from 'react';
import { Provider } from 'mobx-react/native';

import App from './src/App.js';
import * as stores from './src/stores';

class Main extends Component {

  render() {
    return (
      <Provider {...stores}>
        <App />
      </Provider>
    );
  }

}

export default Main;
