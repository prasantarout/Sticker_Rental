/**
 * @format
 */

import {AppRegistry,LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs()
import { Provider } from 'react-redux';
import Store from './src/redux/store/Store';
const Stic = () => {
    return (
      <Provider store={Store}>
        <App />
      </Provider>
    );
  };
  
  AppRegistry.registerComponent(appName, () => Stic);
