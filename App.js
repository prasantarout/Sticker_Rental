import React, {useEffect} from 'react';
import StackNav from './src/navigators/StackNav';
import {Text, TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import {profileRequest, tokenRequest} from './src/redux/reducer/AuthReducer';
import {useNetInfo} from '@react-native-community/netinfo';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import NoInternetModal from './src/components/NoInternetModal';
import { getDeviceToken } from './src/utils/helpers/FirebaseToken';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
export default function App() {
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  useEffect(() => {
    if (Text.defaultProps) {
      Text.defaultProps.allowFontScaling = false;
    } else {
      Text.defaultProps = {};
      Text.defaultProps.allowFontScaling = false;
    }

    if (TextInput.defaultProps) {
      TextInput.defaultProps.allowFontScaling = false;
    } else {
      TextInput.defaultProps = {};
      TextInput.defaultProps.allowFontScaling = false;
    }
  }, []);

  async function requestUserPermission() {
    await notifee.requestPermission();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    getDeviceToken()
      .then(token => {
        console.log(token);
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      requestUserPermission();
    }, 1500);
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM notification arrived!', remoteMessage);
      dispatch(profileRequest())
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    
      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: Platform.OS == 'android' && {
          channelId,
        },
        asForegroundService: true,
      });
    });
    return () => {
      unsubscribe;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StackNav />
      <NoInternetModal netInfo={netInfo} />
    </SafeAreaProvider>
  );
}
