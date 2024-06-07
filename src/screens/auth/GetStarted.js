import React, {Fragment, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ImageBackground,
  Image,
  Text,
  Platform,
} from 'react-native';
import {Colors, Fonts, Icons} from '../../themes/ImagePath';
import MyStatusBar from '../../utils/MyStatusBar';
import normalize from '../../utils/helpers/dimen';
import ButtonCom from '../../components/ButtonCom';
import {
  resetAddressInfo,
  resetPersonalInfo,
  resetCarInfo,
  resetVehicleInfo

} from '../../redux/action/userActions';
import { useDispatch } from 'react-redux';
export default function GetStarted(props) {
  const dispatch=useDispatch();
  return (
    <Fragment>
      <MyStatusBar backgroundColor={Colors.statusbar} />
      <ImageBackground
        source={Icons.Getstarted}
        style={{flex: 1, width: '100%', height: '100%', alignItems: 'center'}}
        resizeMode="stretch">
        <Image
          source={Icons.threedot}
          style={{
            width: normalize(6),
            height: normalize(40),
            resizeMode: 'contain',
            marginTop: Platform.OS == 'android' ? normalize(30) : normalize(15),
          }}
        />
        <Image
          source={Icons.sticlogo}
          style={{
            width: normalize(130),
            height: normalize(130),
            resizeMode: 'contain',
            marginTop: normalize(15),
          }}
        />
        <Text
          style={{
            fontFamily: Fonts.RobotoSlabExtraBold,
            fontSize: normalize(22),
            color: Colors.white,
            marginTop: normalize(30),
          }}>
          EARN AS YOU DRIVE
        </Text>
        <ImageBackground
        resizeMode='contain'
        source={Icons.rec}
          style={{
            width: '90%',
            height: normalize(33),
            borderRadius: normalize(20),
            marginTop: normalize(10),
            alignItems: 'center',
            justifyContent: 'center',
             alignSelf:'center',
             marginLeft:normalize(25)
          }}>
          <Text
            style={{
              fontFamily: Fonts.RobotoMedium,
              color: Colors.white,
              textTransform: 'capitalize',
              fontSize: normalize(13),
              marginRight:normalize(23)
            }}>
            earn up-to 14 cents/miles
          </Text>
        </ImageBackground>
        <Text
          style={{
            color: Colors.lightwhite,
            fontFamily: Fonts.RobotoRegular,
            fontSize: normalize(11),
            width: '66%',
            textAlign: 'center',
            marginTop: normalize(20),
            textTransform: 'capitalize',
          }}>
          Turn miles into money with car ads– no extra work, just extra money.
        </Text>
        <ButtonCom
          onPress={() => {
            props?.navigation?.navigate('Signuppersonalinformation'),
            dispatch(resetPersonalInfo());
            dispatch(resetCarInfo());
            dispatch(resetAddressInfo());
            dispatch(resetVehicleInfo());
          }}
          backgroundColor={Colors.blue}
          fontSize={normalize(11)}
          letterSpacing={normalize(1.5)}
          marginTop={normalize(20)}
          title={'SIGN UP'}
          width={'90%'}
        />
        <ButtonCom
          onPress={() => props?.navigation?.navigate('Signin')}
          fontSize={normalize(11)}
          borderWidth={normalize(1)}
          borderColor={Colors.blue}
          letterSpacing={normalize(1.5)}
          marginTop={normalize(20)}
          textColor={Colors.blue}
          title={'SIGN IN'}
          width={'90%'}
        />
      </ImageBackground>
    </Fragment>
  );
}
