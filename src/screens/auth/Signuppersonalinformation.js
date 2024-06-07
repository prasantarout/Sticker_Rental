import React, {useRef, useState, useEffect} from 'react';

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
  Platform,
  Dimensions,
} from 'react-native';
import {Colors, Fonts, Icons} from '../../themes/ImagePath';
import MyStatusBar from '../../utils/MyStatusBar';
import normalize from '../../utils/helpers/dimen';
import TextInputItem from '../../components/TextInput';
import ButtonCom from '../../components/ButtonCom';
import Modal from 'react-native-modal';
import {setPersonalInfo} from '../../redux/action/userActions';
import {useNavigation} from '@react-navigation/native';
import {connect, useDispatch, useSelector} from 'react-redux';
import {signUpEmailExistRequest} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
import Toast from '../../utils/helpers/Toast';
const Signuppersonalinformation = ({personalInfo, setPersonalInfo}) => {
  const navigation = useNavigation();
  const [passshow, setpassshow] = useState(true);
  const [remember, setremember] = useState(false);
  const [confirmpassshow, setconfirmpassshow] = useState(true);
  const [twofactor, settwofactor] = useState(false);
  const dispatch = useDispatch();

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const AuthReducer = useSelector(state => state.AuthReducer);

  const handleInputChange = (field, text) => {
    setPersonalInfo({...personalInfo, [field]: text});
  };

  const handleEmailExistOrNot = () => {
    if (personalInfo.firstName === '') {
      Toast('Please enter your first name');
      return;
    }
    if (personalInfo.lastName === '') {
      Toast('Please enter your last name');
      return;
    }
    if (/^\s+$/.test(personalInfo.firstName)) {
      Toast('Please enter valid first name');
      return;
    }
    if (/^\s+$/.test(personalInfo.lastName)) {
      Toast('Please enter valid last name');
      return;
    }
    if (personalInfo.email == '') {
      Toast('Please enter your email address');
      return;
    }
    if (!regex.test(personalInfo.email)) {
      Toast('Please enter valid email address');
      return;
    }
    if (personalInfo.password == '') {
      Toast('Please enter your password');
      return;
    }
    if (personalInfo.confirmPassword == '') {
      Toast('Please enter your confirm password');
      return;
    }
    if (personalInfo.password !== personalInfo.confirmPassword) {
      Toast('Password and confirm password should be same');
      return;
    } else {
      let obj = {
        email: personalInfo?.email,
      };
      dispatch(signUpEmailExistRequest(obj));
    }
  };

  //  navigation?.navigate('Selectbrand');
  let status = '';
  useEffect(() => {
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/signUpEmailExistRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/signUpEmailExistSuccess':
          status = AuthReducer.status;
          navigation?.navigate('Signupcarinformation');
          break;
        case 'Auth/signUpEmailExistFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);

  return (
    <ImageBackground
      style={{width: '100%', height: '100%', position: 'absolute'}}
      resizeMode="stretch"
      source={Icons.SignIn}>
      <Loader
        visible={AuthReducer?.status === 'Auth/signUpEmailExistRequest'}
      />
      <MyStatusBar backgroundColor={Colors.statusbar} />

      <SafeAreaView style={{height: '100%', width: '90%', alignSelf: 'center'}}>
        <ImageBackground
          style={{
            width: '100%',
            height: Dimensions.get('window').height,
            position: 'absolute',
            top:
              Platform.OS === 'ios'
                ? Dimensions.get('window').height > 736
                  ? normalize(-10)
                  : normalize(45)
                : normalize(45),
          }}
          resizeMode="contain"
          source={Icons.curvedborder}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={{
              marginTop:
                Platform.OS === 'ios'
                  ? Dimensions.get('window').height > 736
                    ? normalize(20)
                    : normalize(-25)
                  : normalize(0),
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
          <Image
            resizeMode="contain"
            source={Icons.signinlogo}
            style={{
              width: normalize(130),
              height: normalize(130),
              alignSelf: 'center',
              // borderRadius: normalize(65),
              // overflow: 'visible',
              // position: 'absolute',
              // top:
              //   Dimensions.get('window').height > 900
              //     ? normalize(30)
              //     : Platform.OS == 'android'
              //     ? normalize(55)
              //     : normalize(60),
              marginTop:
                Platform.OS === 'ios'
                  ? Dimensions.get('window').height > 736
                    ? normalize(26)
                    : normalize(10)
                  : normalize(22),
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            style={{flex: 1}}>
            <ScrollView
              contentContainerStyle={{paddingBottom: normalize(70)}}
              keyboardShouldPersistTaps="handled"
              style={{
                marginTop: normalize(28),
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
                source={Icons.l0}
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
                Personal Information
              </Text>

              <TextInputItem
                placeholder={'First Name'}
                isleftimage={true}
                leftimage={Icons.nameicon}
                value={personalInfo.firstName || ''}
                onChangeText={text => handleInputChange('firstName', text)}
                marginTop={normalize(15)}
              />
              <TextInputItem
                placeholder={'Last Name'}
                isleftimage={true}
                leftimage={Icons.nameicon}
                value={personalInfo.lastName || ''}
                onChangeText={text => handleInputChange('lastName', text)}
                marginTop={normalize(15)}
              />
              <TextInputItem
                placeholder={'Email Address'}
                isleftimage={true}
                leftimage={Icons.email}
                value={personalInfo.email || ''}
                onChangeText={text => handleInputChange('email', text)}
                // marginTop={normalize(40)}
              />

              <TextInputItem
                placeholder={'Password'}
                isleftimage={true}
                leftimage={Icons.password}
                value={personalInfo.password || ''}
                onChangeText={text => handleInputChange('password', text)}
                isSecure={passshow}
                isrightimage={true}
                rightimagepress={() => setpassshow(!passshow)}
                showhide={passshow}
              />
              <TextInputItem
                placeholder={'Confirm Password'}
                isleftimage={true}
                leftimage={Icons.password}
                value={personalInfo.confirmPassword || ''}
                onChangeText={text =>
                  handleInputChange('confirmPassword', text)
                }
                isSecure={confirmpassshow}
                isrightimage={true}
                rightimagepress={() => setconfirmpassshow(!confirmpassshow)}
                showhide={confirmpassshow}
              />

              <ButtonCom
                onPress={() => {
                  // navigation?.navigate('Signupcarinformation');
                  handleEmailExistOrNot();
                }}
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
          </KeyboardAvoidingView>
        </ImageBackground>
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapStateToProps = state => ({
  personalInfo: state.user.personalInfo,
});

const mapDispatchToProps = {
  setPersonalInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signuppersonalinformation);
