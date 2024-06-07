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
import CameraPicker from '../../components/CameraPicker';
import {setVehicleInfo} from '../../redux/action/userActions';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Toast from '../../utils/helpers/Toast';
const Vehicleid = ({vehicleInfo, setVehicleInfo}) => {
  const [ProfilePicObj, setProfilePicObj] = useState('');
  const [ProfilePicUri, setProfilePicUri] = useState('');
  const [cameraPicker, setCameraPicker] = useState(false);
  const navigation = useNavigation();

  const handleCameraUpload = (field, imgObj) => {
    setCameraPicker(null);
    setVehicleInfo({...vehicleInfo, [field]: imgObj});
  };

  const removeImage = field => {
    setVehicleInfo({...vehicleInfo, [field]: null});
  };

  const handleVehicleInformation = () => {
    if (vehicleInfo?.uploadDrivingLicense === null) {
      Toast('Please upload your driving license of front side');
      return;
    }
    if (vehicleInfo?.uploadGovtIdCard === null) {
      Toast('Please upload your driving license of back side');
      return;
    }
    if (vehicleInfo?.uploadVinNumberCar == null) {
      Toast('Please upload your vin number car');
      return;
    
    }
    if (vehicleInfo?.uploadCarImage === null) {
      Toast('Please upload your car image');
      return;
    } else {
      navigation?.navigate('Signupaddress');
    }
  };

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
              style={{
                width: '100%',
                height: '100%',
                top:
                  Platform.OS === 'ios'
                    ? Dimensions.get('window').height > 736
                      ? normalize(10)
                      : normalize(8)
                    : normalize(15),
              }}
              resizeMode="stretch"
              source={Icons.curvedborder}>
              <Image
                source={Icons.signinlogo}
                style={{
                  width: normalize(130),
                  height: normalize(130),
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  top:
                    Platform.OS === 'ios'
                      ? Dimensions.get('window').height > 736
                        ? normalize(-34)
                        : normalize(-43)
                      : normalize(-35),
                }}
              />
              <ScrollView
                contentContainerStyle={{paddingBottom: normalize(15)}}
                style={{
                  // marginTop: normalize(),
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
                  CREATE AN ACCOUNT
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(12),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                    marginTop: normalize(10),
                  }}>
                  Please Create Your Account
                </Text>
                <Image
                  source={Icons.l2}
                  style={{
                    width: '100%',
                    height: normalize(4),
                    resizeMode: 'stretch',
                    marginVertical: normalize(25),
                  }}
                />
                <Text
                  style={{
                    fontFamily: Fonts.RobotoMedium,
                    fontSize: normalize(12),
                    color: Colors.blue,
                    textAlign: 'center',
                  }}>
                  Vehicle Information
                </Text>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: normalize(15),
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      width: normalize(125),
                      height: normalize(125),
                      borderRadius: normalize(12),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      if (vehicleInfo?.uploadDrivingLicense === null) {
                        setCameraPicker('uploadDrivingLicense');
                      }
                    }}>
                    <Image
                      source={
                        vehicleInfo?.uploadDrivingLicense !== null
                          ? {uri: vehicleInfo?.uploadDrivingLicense?.uri}
                          : Icons.gallery
                      }
                      style={{
                        width:
                          vehicleInfo?.uploadDrivingLicense == null
                            ? normalize(45)
                            : normalize(105),
                        height:
                          vehicleInfo?.uploadDrivingLicense == null
                            ? normalize(45)
                            : normalize(85),
                        resizeMode: 'cover',
                        borderRadius: 5,
                      }}
                    />
                    {vehicleInfo?.uploadDrivingLicense !== null && (
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          alignSelf: 'flex-end',
                          top: 0,
                          marginVertical: normalize(15),
                          right: normalize(5),
                        }}
                        onPress={() => removeImage('uploadDrivingLicense')}>
                        <Image
                          source={Icons.redcross}
                          style={{height: normalize(15), width: normalize(15)}}
                        />
                      </TouchableOpacity>
                    )}
                    {vehicleInfo?.uploadDrivingLicense == null && (
                      <Text
                        style={{
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(11),
                          color: Colors.white,
                          textAlign: 'center',
                          marginTop: normalize(10),
                          width: '90%',
                          lineHeight: normalize(18),
                        }}>
                        Upload Your Driving License (Front)
                      </Text>
                    )}
                  </TouchableOpacity>
                 
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      width: normalize(125),
                      height: normalize(125),
                      borderRadius: normalize(12),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      if (vehicleInfo?.uploadGovtIdCard === null) {
                        setCameraPicker('uploadGovtIdCard');
                      }
                    }}>
                    <Image
                      source={
                        vehicleInfo?.uploadGovtIdCard !== null
                          ? {uri: vehicleInfo?.uploadGovtIdCard?.uri}
                          : Icons.gallery
                      }
                      style={{
                        width:
                          vehicleInfo?.uploadGovtIdCard == null
                            ? normalize(45)
                            : normalize(105),
                        height:
                          vehicleInfo?.uploadGovtIdCard == null
                            ? normalize(45)
                            : normalize(85),
                        resizeMode: 'cover',
                        borderRadius: 5,
                      }}
                    />
                    {vehicleInfo?.uploadGovtIdCard !== null && (
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          alignSelf: 'flex-end',
                          top: 0,
                          marginVertical: normalize(15),
                          right: normalize(5),
                        }}
                        onPress={() => removeImage('uploadGovtIdCard')}>
                        <Image
                          source={Icons.redcross}
                          style={{height: normalize(15), width: normalize(15)}}
                        />
                      </TouchableOpacity>
                    )}
                    {vehicleInfo?.uploadGovtIdCard == null && (
                      <Text
                        style={{
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(11),
                          color: Colors.white,
                          textAlign: 'center',
                          marginTop: normalize(10),
                          width: '90%',
                          lineHeight: normalize(18),
                        }}>
                        Upload Your Driving License (back)
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: normalize(20),
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      width: normalize(125),
                      height: normalize(125),
                      borderRadius: normalize(12),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      if (vehicleInfo?.uploadVinNumberCar === null) {
                        setCameraPicker('uploadVinNumberCar');
                      }
                    }}>
                    <Image
                      source={
                        vehicleInfo?.uploadVinNumberCar !== null
                          ? {uri: vehicleInfo?.uploadVinNumberCar?.uri}
                          : Icons.gallery
                      }
                      style={{
                        width:
                          vehicleInfo?.uploadVinNumberCar == null
                            ? normalize(45)
                            : normalize(105),
                        height:
                          vehicleInfo?.uploadVinNumberCar == null
                            ? normalize(45)
                            : normalize(85),
                        resizeMode: 'cover',
                        borderRadius: 5,
                      }}
                    />
                    {vehicleInfo?.uploadVinNumberCar !== null && (
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          alignSelf: 'flex-end',
                          top: 0,
                          marginVertical: normalize(15),
                          right: normalize(5),
                        }}
                        onPress={() => removeImage('uploadVinNumberCar')}>
                        <Image
                          source={Icons.redcross}
                          style={{height: normalize(15), width: normalize(15)}}
                        />
                      </TouchableOpacity>
                    )}
                    {vehicleInfo?.uploadVinNumberCar == null && (
                      <Text
                        style={{
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(11),
                          color: Colors.white,
                          textAlign: 'center',
                          marginTop: normalize(10),
                          width: '80%',
                          lineHeight: normalize(18),
                        }}>
                        VIN Number Car
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      width: normalize(125),
                      height: normalize(125),
                      borderRadius: normalize(12),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      if (vehicleInfo?.uploadCarImage === null) {
                        setCameraPicker('uploadCarImage');
                      }
                    }}>
                    <Image
                      source={
                        vehicleInfo?.uploadCarImage !== null
                          ? {uri: vehicleInfo?.uploadCarImage?.uri}
                          : Icons.gallery
                      }
                      style={{
                        width:
                          vehicleInfo?.uploadCarImage == null
                            ? normalize(45)
                            : normalize(105),
                        height:
                          vehicleInfo?.uploadCarImage == null
                            ? normalize(45)
                            : normalize(85),
                        resizeMode: 'cover',
                        borderRadius: 5,
                      }}
                    />
                    {vehicleInfo?.uploadCarImage !== null && (
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          alignSelf: 'flex-end',
                          top: 0,
                          marginVertical: normalize(15),
                          right: normalize(5),
                        }}
                        onPress={() => removeImage('uploadCarImage')}>
                        <Image
                          source={Icons.redcross}
                          style={{height: normalize(15), width: normalize(15)}}
                        />
                      </TouchableOpacity>
                    )}
                    {vehicleInfo?.uploadCarImage == null && (
                      <Text
                        style={{
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(11),
                          color: Colors.white,
                          textAlign: 'center',
                          marginTop: normalize(10),
                          width: '80%',
                          lineHeight: normalize(18),
                        }}>
                        Upload Car Images
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <ButtonCom
                  onPress={handleVehicleInformation}
                  backgroundColor={Colors.blue}
                  fontSize={normalize(11)}
                  letterSpacing={normalize(1.5)}
                  marginTop={normalize(20)}
                  title={'NEXT'}
                  width={'100%'}
                />
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginTop: normalize(17),
                  }}>
                  <Text
                    style={{
                      color: Colors.grey,
                      textAlign: 'center',
                      fontFamily: Fonts.RobotoSlabMedium,
                      fontSize: normalize(12),
                    }}>
                    Already Have An Account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation?.navigate('Signin')}>
                    <Text
                      style={{
                        color: Colors.blue,
                        fontFamily: Fonts.RobotoSlabExtraBold,
                        fontSize: normalize(13),
                      }}>
                      {' '}
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </ImageBackground>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      {cameraPicker && (
        <CameraPicker
          pickerVisible={cameraPicker}
          multiple={false}
          onBackdropPress={() => setCameraPicker(false)}
          btnClick_cameraUpload={imgObj => {
            setProfilePicObj(imgObj);
            setProfilePicUri(imgObj.uri);
            setCameraPicker(false);
            handleCameraUpload(cameraPicker, imgObj);
            // UploadProfile(imgObj);
          }}
          btnClick_galeryUpload={imgObj => {
            setProfilePicObj(imgObj);
            setProfilePicUri(imgObj.uri);
            setCameraPicker(false);
            handleCameraUpload(cameraPicker, imgObj);
            // UploadProfile(imgObj);
          }}
        />
      )}
    </ImageBackground>
  );
};

const mapStateTonavigation = state => ({
  vehicleInfo: state.user.vehicleInfo,
});

const mapDispatchTonavigation = {
  setVehicleInfo,
};

export default connect(
  mapStateTonavigation,
  mapDispatchTonavigation,
)(Vehicleid);
