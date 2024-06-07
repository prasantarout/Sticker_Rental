import React, {useRef, useState} from 'react';

import {
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import {Colors, Fonts, Icons} from '../../themes/ImagePath';
import MyStatusBar from '../../utils/MyStatusBar';
import normalize from '../../utils/helpers/dimen';
import ButtonCom from '../../components/ButtonCom';
import {setCarInfo} from '../../redux/action/userActions';
import {connect, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import constants from '../../utils/helpers/constants';

const Carrecognize = ({carInfo}) => {
  console.log(carInfo, '>>>>>>>respoms');
  const AuthReducer = useSelector(state => state.AuthReducer);
  console.log(AuthReducer?.vehicleModelListRes?.data, '>>>>>>resp');
  const navigation = useNavigation();
  return (
    <ImageBackground
      style={{width: '100%', height: '100%', position: 'absolute'}}
      resizeMode="stretch"
      source={Icons.SignIn}>
      <MyStatusBar backgroundColor={Colors.statusbar} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <SafeAreaView
          style={{height: '100%', width: '90%', alignSelf: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={{
              marginTop:
              Platform.OS === 'ios'
              ? Dimensions.get('window').height > 736
                ? normalize(10)
                : normalize(20)
              : normalize(50),
                // Platform.OS == 'android' ? normalize(50) : normalize(10),
              width: normalize(40),
              height: normalize(15),
            }}>
            <Image
              source={Icons.backicon}
              style={{
                width: normalize(40),
                height: normalize(15),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              marginTop: normalize(50),
              height: Platform.OS == 'android' ? '78%' : '85%',
            }}>
            <ImageBackground
              style={{width: '100%', height: '100%',top:
              Platform.OS === 'ios'
                ? Dimensions.get('window').height > 736
                  ? normalize(10)
                  : normalize(8)
                : normalize(20),}}
              resizeMode="stretch"
              source={Icons.curvedborder}>
              <Image
              resizeMode= 'contain'
                source={Icons.signinlogo}
                style={{
                  width: normalize(130),
                  height: normalize(130),
                  alignSelf: 'center',
                  top:
                  Platform.OS === 'ios'
                  ? Dimensions.get('window').height > 736
                    ? normalize(-34)
                    : normalize(-43)
                  : normalize(-34),
                    // Dimensions.get('window').height > 900
                    //   ? -normalize(30)
                    //   : -normalize(42),
                }}
              />
              <ScrollView
                contentContainerStyle={{paddingBottom: normalize(15)}}
                style={{
                  paddingHorizontal: normalize(10),
                }}
                showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoSlabExtraBold,
                    color: Colors.white,
                    fontSize: normalize(17),
                    textAlign: 'center',
                  }}>
                  CAR IDENTIFICATION
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(12),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                    marginTop: normalize(10),
                  }}>
                  Please Confirm Your Vehicle Details Below
                </Text>
                <Image
                  source={
                    AuthReducer?.vehicleModelListRes?.data?.length > 0
                      ? {
                          uri:
                            constants?.IMAGE_URL +
                            '/vehicle/' +
                            AuthReducer?.vehicleModelListRes?.data[0]
                              ?.car_image,
                        }
                      : Icons.car
                  }
                  style={{
                    width: '100%',
                    height: normalize(150),
                    resizeMode: 'contain',
                    marginTop: normalize(15),
                  }}
                />
                <Text
                  style={{
                    fontFamily: Fonts.RobotoSlabExtraBold,
                    color: Colors.white,
                    fontSize: normalize(16),
                    marginTop: normalize(15),
                  }}>
                  CAR Description:
                </Text>

                {/* <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: normalize(10),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoRegular,
                      fontSize: normalize(13),
                      color: Colors.grey,
                      textAlign: 'center',
                      marginTop: normalize(10),
                    }}>
                    Car Name:
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoRegular,
                      fontSize: normalize(13),
                      color: Colors.white,
                      textAlign: 'center',
                      marginTop: normalize(10),
                    }}>
                    {carInfo.carName}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: normalize(10),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoRegular,
                      fontSize: normalize(13),
                      color: Colors.grey,
                      textAlign: 'center',
                      marginTop: normalize(10),
                    }}>
                    Model Number:
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoRegular,
                      fontSize: normalize(13),
                      color: Colors.white,
                      textAlign: 'center',
                      marginTop: normalize(10),
                    }}>
                    {carInfo.modelNumber}
                  </Text>
                </View> */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: normalize(10),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoRegular,
                      fontSize: normalize(13),
                      color: Colors.grey,
                      textAlign: 'center',
                      marginTop: normalize(10),
                    }}>
                    VIN Number:
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoRegular,
                      fontSize: normalize(13),
                      color: Colors.white,
                      textAlign: 'center',
                      marginTop: normalize(10),
                    }}>
                    {carInfo.vinNumber}
                  </Text>
                </View>
                {/* <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: normalize(10),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoRegular,
                      fontSize: normalize(13),
                      color: Colors.grey,
                      textAlign: 'center',
                      marginTop: normalize(10),
                    }}>
                    Number Of Doors:
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoRegular,
                      fontSize: normalize(13),
                      color: Colors.white,
                      textAlign: 'center',
                      marginTop: normalize(10),
                    }}>
                    {carInfo.totalDoors}
                  </Text>
                </View> */}
                <View
                  style={{
                    width: '100%',
                    height: normalize(1.5),
                    backgroundColor: Colors.blue,
                    marginTop: normalize(17),
                  }}
                />
                <ButtonCom
                  onPress={() => navigation?.navigate('Vehicleid')}
                  backgroundColor={Colors.blue}
                  fontSize={normalize(11)}
                  letterSpacing={normalize(1.5)}
                  marginTop={normalize(20)}
                  title={`YES, IT'S MINE`}
                  width={'100%'}
                />
                <ButtonCom
                  fontSize={normalize(11)}
                  borderWidth={normalize(1)}
                  borderColor={Colors.blue}
                  letterSpacing={normalize(1.5)}
                  marginTop={normalize(20)}
                  textColor={Colors.blue}
                  title={`NO, IT'S NOT MINE`}
                  width={'100%'}
                  onPress={() => navigation?.goBack('')}
                />
              </ScrollView>
            </ImageBackground>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const mapStateTonavigation = state => ({
  carInfo: state.user.carInfo,
});
export default connect(mapStateTonavigation)(Carrecognize);
