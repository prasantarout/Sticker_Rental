import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {ActivityIndicator, Dimensions, Linking} from 'react-native';
import Splash from '../screens/splashScreen/Splash';
import GetStarted from '../screens/auth/GetStarted';
import Signin from '../screens/auth/Signin';
import Signupcarinformation from '../screens/auth/Signupcarinformation';
import Signuppersonalinformation from '../screens/auth/Signuppersonalinformation';

import Carrecognize from '../screens/auth/Carrecognize';
import Vehicleid from '../screens/auth/Vehicleid';
import Signupaddress from '../screens/auth/Signupaddress';
import Selectbrand from '../screens/auth/Selectbrand';
import Selectstickers from '../screens/auth/Selectstickers';
import Home from '../screens/home/Home';
import Profile from '../screens/home/Profile';
import Earning from '../screens/home/Earning';
import Mysticker from '../screens/home/Mysticker';
import {useSelector} from 'react-redux';
import Faq from '../screens/home/Faq';
import PrivacyPolicy from '../screens/home/PrivacyPolicy';
import Terms from '../screens/home/Terms';
import StartJourney from '../screens/home/StartJourney';
import UploadSticker from '../screens/home/UploadSticker';
const {width, height} = Dimensions.get('window');

const StackNav = props => {
  const Stack = createStackNavigator();
  const AuthReducer = useSelector(state => state.AuthReducer);

  // console.log(AuthReducer.isLoading);
  const mytheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
    },
  };
  const Screens =
    AuthReducer?.tokenResponse == null
      ? {
          GetStarted: GetStarted,
          Signin: Signin,
          Signuppersonalinformation: Signuppersonalinformation,
          Signupcarinformation,
          Signupcarinformation,
          Carrecognize: Carrecognize,
          Vehicleid,
          Vehicleid,
          Signupaddress: Signupaddress,
          Selectbrand: Selectbrand,
          Selectstickers,
          Selectstickers,
        }
      : {
        //  StartJourney: StartJourney,
          Home: Home,
          Profile: Profile,
          Earning: Earning,
          Mysticker: Mysticker,
      Faq:Faq,
      PrivacyPolicy:PrivacyPolicy,
      Terms:Terms,
      UploadSticker:UploadSticker,
      
        };

  if (AuthReducer.isLoading) {
    return <Splash />;
  } else {
    return (
      <NavigationContainer theme={mytheme}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {Object.entries({
            ...Screens,
          }).map(([name, component]) => {
            return <Stack.Screen name={name} component={component} />;
          })}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default StackNav;
