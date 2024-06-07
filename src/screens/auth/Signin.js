import React, {useEffect, useRef, useState} from 'react';

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
import TextInputItem from '../../components/TextInput';
import ButtonCom from '../../components/ButtonCom';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../utils/helpers/constants';
import Toast from '../../utils/helpers/Toast';
import {useDispatch, useSelector} from 'react-redux';
import connectionrequest from '../../utils/helpers/NetInfo';
import {
  forgotPasswordSendEmailRequest,
  forgotpasswordRequest,
  loginRequest,
  otpverificationRequest,
  resendOtpRequest,
} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
import showErrorAlert from '../../utils/helpers/Toast';
import {
  resetAddressInfo,
  resetCarInfo,
  resetPersonalInfo,
  resetVehicleInfo,
} from '../../redux/action/userActions';
import { getDeviceToken } from '../../utils/helpers/FirebaseToken';
export default function Signin(props) {
  const [passshow, setpassshow] = useState(true);
  const [password, setpassword] = useState('');
  const [email, setemail] = useState('');
  const [remember, setremember] = useState(false);
  const [twofactor, settwofactor] = useState(false);
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);

  ////forgot part
  const [forgotmodal, setforgotmodal] = useState(false);
  const [forgotemail, setforgotemail] = useState('');
  const [forgotstatus, setforgotstatus] = useState(0);

  const [pinforgot1, setPinforgot1] = useState('');
  const [pinforgot2, setPinforgot2] = useState('');
  const [pinforgot3, setPinforgot3] = useState('');
  const [pinforgot4, setPinforgot4] = useState('');
  const inputRefforgot1 = useRef(null);
  const inputRefforgot2 = useRef(null);
  const inputRefforgot3 = useRef(null);
  const inputRefforgot4 = useRef(null);

  const [forgotpassshow, setforgotpassshow] = useState(true);
  const [forgotpassword, setforgotpassword] = useState('');
  const [forgotconfirmpassshow, setforgotconfirmpassshow] = useState(true);
  const [forgotconfirmpassword, setforgotconfirmpassword] = useState('');
  // console.log(Dimensions.get('window').height);
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const blankspace = /\s/;

  const dispatch = useDispatch();

  function signinfunction(device_token) {
    if (email == '') {
      Toast('Please enter email id');
    } else if (!regex.test(email)) {
      Toast('Please enter correct email');
    } else if (password == '') {
      Toast('Please enter password');
    } else if (password.length < 6) {
      Toast('Please enter atleast 6 digit password');
    } else if (blankspace.test(password)) {
      Toast('Please enter correct password');
    } else {
      let obj1 = {
        email: email?.toLowerCase(),
        password: password,
        device_type:Platform.OS,
        device_token:device_token,
      };
      let obj = {
        obj1: obj1,
        remember: remember,
      };
      connectionrequest()
        .then(() => {
          dispatch(loginRequest(obj));
          //props?.navigation?.navigate('Login')
        })
        .catch(err => {
          Toast('Please connect To Internet');
        });
    }
  }

  useEffect(() => {
    AsyncStorage.getItem(constants.CREAD)
      .then(E => {
        if (E && E != '') {
          console.log(E);
          const jsonRes = JSON.parse(E);
          console.log(jsonRes, 'hihihihh');
          setemail(jsonRes?.email ?? '');
          setpassword(jsonRes?.password ?? '');
          setremember(true);
        }
      })
      .catch(E => {
        console.log(E);
      });
  }, []);

  const handleForgotPassword = forgotPassword => {
    if (forgotemail == '') {
      showErrorAlert('Please enter your email address');
      return;
    }
    if (!regex.test(forgotemail)) {
      showErrorAlert('Please enter correct email');
      return;
    } else {
      let url = {
        email: forgotemail?.toLowerCase(),
      };
      connectionrequest()
        .then(() => {
          dispatch(forgotPasswordSendEmailRequest(url));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
        });
    }
  };

  const handleVerifyOtp = () => {
    if (
      pinforgot1 == '' ||
      pinforgot2 == '' ||
      pinforgot2 == '' ||
      pinforgot4 == ''
    ) {
      showErrorAlert('Please enter a valid otp');
      return;
    } else {
      let obj = {
        email: forgotemail?.toLowerCase(),
        otp: pinforgot1 + pinforgot2 + pinforgot3 + pinforgot4,
      };
      connectionrequest()
        .then(() => {
          dispatch(otpverificationRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
        });
    }
  };

  const handleResendOtp = () => {
    let obj = {
      email: forgotemail?.toLowerCase(),
    };

    connectionrequest()
      .then(() => {
        //console.log(obj);

        dispatch(resendOtpRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
      });
  };

  const handleChangePassword = () => {
    if (forgotpassword === '') {
      showErrorAlert('Please enter your password');
      return;
    }
    if (forgotpassword.length < 6) {
      showErrorAlert('Please enter atleast 6 digit password');
      return;
    }
    if (forgotconfirmpassword === '') {
      showErrorAlert('Please enter your confirm password');
      return;
    }
    if (forgotpassword !== forgotconfirmpassword) {
      showErrorAlert('Password and confirm password did not match');
      return;
    }
    // if()
    let obj = {
      email: forgotemail?.toLowerCase(),
      password: forgotconfirmpassword,
    };

    connectionrequest()
      .then(() => {
        //console.log(obj);

        dispatch(forgotpasswordRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
      });
  };

  const handleSignUpPress = () => {
    // Dispatch actions to reset the information stored in the reducer
    dispatch(resetPersonalInfo());
    dispatch(resetCarInfo());
    dispatch(resetVehicleInfo());
    dispatch(resetAddressInfo());

    // Navigate to the Signuppersonalinformation screen
    props.navigation.navigate('Signuppersonalinformation');
  };

  useEffect(() => {
    let status = '';
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/forgotPasswordSendEmailRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/forgotPasswordSendEmailSuccess':
          status = AuthReducer.status;
          setforgotstatus(1);
          // setemail('');
          break;
        case 'Auth/forgotPasswordSendEmailFailure':
          status = AuthReducer.status;
          break;
        case 'Auth/otpverificationRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/otpverificationSuccess':
          status = AuthReducer.status;
          setforgotstatus(2);
          break;
        case 'Auth/otpverificationFailure':
          status = AuthReducer.status;
          break;

        case 'Auth/changePasswordRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/forgotpasswordSuccess':
          status = AuthReducer.status;
          // setforgotpassstatus(4);
          setforgotmodal(false);
          setforgotemail(''),
            setPinforgot1(''),
            setPinforgot2(''),
            setPinforgot3(''),
            setPinforgot4(''),
            setforgotpassword(''),
            setforgotconfirmpassword(''),
            setforgotstatus(0);
          break;
        case 'Auth/forgotpasswordFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);

  return (
    <>
      <Loader visible={AuthReducer?.status == 'Auth/loginRequest'} />
      <ImageBackground
        style={{width: '100%', height: '100%', position: 'absolute'}}
        resizeMode="stretch"
        source={Icons.SignIn}>
        <MyStatusBar backgroundColor={Colors.statusbar} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          style={{flex: 1}}>
          <SafeAreaView
            style={{height: '100%', width: '90%', alignSelf: 'center'}}>
            <TouchableOpacity
              onPress={() => props?.navigation?.goBack()}
              style={{
                marginTop:
                  Platform.OS == 'android' ? normalize(45) : normalize(10),
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: '100%',
                height: Platform.OS == 'android' ? '78%' : '85%',
                marginTop: normalize(20),
              }}>
              <Image
                source={Icons.signinlogo}
                style={{
                  width: normalize(130),
                  height: normalize(130),
                  alignSelf: 'center',
                  position: 'absolute',
                  top:
                    Platform.OS === 'ios'
                      ? Dimensions.get('window').height > 736
                        ? normalize(3)
                        : normalize(3)
                      : normalize(7),
                }}
              />
              <ImageBackground
                style={{
                  width: '100%',
                  height: '100%',
                  marginTop: normalize(15),
                }}
                resizeMode="contain"
                source={Icons.curvedborder}>
                <ScrollView
                  contentContainerStyle={{paddingBottom: normalize(15)}}
                  style={{
                    marginTop: normalize(150),
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
                    WELCOME BACK
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoRegular,
                      fontSize: normalize(12),
                      color: Colors.lightwhite,
                      textAlign: 'center',
                      marginTop: normalize(10),
                      textTransform: 'capitalize',
                    }}>
                    Please sign in to your account
                  </Text>
                  <TextInputItem
                    placeholder={'Email Address'}
                    isleftimage={true}
                    leftimage={Icons.email}
                    onChangeText={val => setemail(val)}
                    value={email}
                    marginTop={normalize(40)}
                  />

                  <TextInputItem
                    placeholder={'Password'}
                    isleftimage={true}
                    leftimage={Icons.password}
                    onChangeText={val => setpassword(val)}
                    value={password}
                    isSecure={passshow}
                    isrightimage={true}
                    rightimagepress={() => setpassshow(!passshow)}
                    showhide={passshow}
                  />
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      marginTop: normalize(20),
                    }}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => setremember(!remember)}
                        style={{
                          width: normalize(30),
                          height: normalize(16),
                          backgroundColor: Colors.inputbackgroundcolor,
                          borderRadius: normalize(8),
                          justifyContent: 'center',
                          paddingHorizontal: normalize(3),
                        }}>
                        <View
                          style={{
                            width: normalize(12),
                            height: normalize(12),
                            backgroundColor: remember
                              ? Colors.blue
                              : Colors.white,
                            borderRadius: normalize(6),
                            alignSelf: remember ? 'flex-end' : 'flex-start',
                          }}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          marginLeft: normalize(8),
                          color: Colors.white,
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(12),
                        }}>
                        Remember Me
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setforgotmodal(true)}>
                      <Text
                        style={{
                          marginLeft: normalize(8),
                          color: Colors.blue,
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(12),
                        }}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ButtonCom
                    onPress={
                      () => {
                      connectionrequest()
                      .then(() => {
                        getDeviceToken()
                          .then(token => {
                            signinfunction(token)
                          })
                          .catch(() => {
                            signinfunction('')
                          });
                      })
                      .catch(() => {
                        showErrorAlert('Please connect your internet');
                      });
                    }
                    }
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(45)}
                    title={'SIGN IN'}
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
                      Don’t Have An Account?
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleSignUpPress();
                        props?.navigation?.navigate(
                          'Signuppersonalinformation',
                        );
                      }}>
                      <Text
                        style={{
                          color: Colors.blue,
                          fontFamily: Fonts.RobotoSlabExtraBold,
                          fontSize: normalize(13),
                        }}>
                        {' '}
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </ImageBackground>
            </ScrollView>
          </SafeAreaView>
          <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={twofactor}
            style={{width: '100%', alignSelf: 'center', margin: 0}}
            animationInTiming={800}
            animationOutTiming={1000}
            avoidKeyboard={true}
            backdropColor={'#1e2633'}
            backdropOpacity={0.7}>
            <View
              style={{
                flex: 1,
                //   backgroundColor: '#FFFFFF',
                position: 'absolute',
                bottom: normalize(10),
                left: 0,
                right: 0,
                borderTopRightRadius: normalize(20),
                borderTopLeftRadius: normalize(20),
                paddingVertical: normalize(10),
                alignItems: 'center',
              }}
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
              <View style={{width: '90%', alignSelf: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    settwofactor(false), setemail('');
                  }}
                  style={{alignSelf: 'flex-end', marginBottom: normalize(12)}}>
                  <Image
                    style={{
                      width: normalize(16),
                      height: normalize(16),
                      resizeMode: 'contain',
                    }}
                    source={Icons.redcross}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.statusbar,
                    borderRadius: normalize(15),
                    paddingTop: normalize(30),
                    paddingHorizontal: normalize(10),
                    paddingBottom: normalize(20),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.RobotoSlabExtraBold,
                      color: Colors.white,
                      fontSize: normalize(20),
                    }}>
                    TWO-FACTOR
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.RobotoSlabExtraBold,
                      color: Colors.white,
                      fontSize: normalize(20),
                      textTransform: 'uppercase',
                    }}>
                    authenticator
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: normalize(15),
                    }}>
                    <View
                      style={[
                        styles.viewstyle,
                        // {
                        //   borderColor: pin1status
                        //     ? Colors.button
                        //     : Colors.bordercolor,
                        // },
                      ]}>
                      <TextInput
                        value={pin1}
                        ref={inputRef1}
                        onChangeText={value => {
                          setPin1(value);
                          if (!pin1.length > 0) {
                            inputRef2.current.focus();
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={1}
                        style={{
                          ...styles.title,
                        }}
                        returnKeyType={'done'}
                      />
                    </View>
                    <View style={[styles.viewstyle]}>
                      <TextInput
                        value={pin2}
                        ref={inputRef2}
                        onChangeText={value => {
                          setPin2(value);
                          if (!pin2.length > 0) {
                            inputRef3.current.focus();
                          } else {
                            inputRef1.current.focus();
                          }
                        }}
                        keyboardType="numeric"
                        onKeyPress={({nativeEvent}) => {
                          if (nativeEvent.key === 'Backspace') {
                            inputRef1.current.focus();
                          }
                        }}
                        maxLength={1}
                        style={{
                          ...styles.title,
                        }}
                        returnKeyType={'done'}
                      />
                    </View>
                    <View style={[styles.viewstyle]}>
                      <TextInput
                        value={pin3}
                        ref={inputRef3}
                        onChangeText={value => {
                          setPin3(value);
                          if (!pin3.length > 0) {
                            inputRef4.current.focus();
                          } else {
                            inputRef2.current.focus();
                          }
                        }}
                        keyboardType="numeric"
                        onKeyPress={({nativeEvent}) => {
                          if (nativeEvent.key === 'Backspace') {
                            inputRef2.current.focus();
                          }
                        }}
                        maxLength={1}
                        style={{
                          ...styles.title,
                        }}
                        returnKeyType={'done'}
                      />
                    </View>
                    <View style={[styles.viewstyle]}>
                      <TextInput
                        value={pin4}
                        ref={inputRef4}
                        onChangeText={value => {
                          setPin4(value);
                          if (!pin4.length > 0) {
                            inputRef4.current.focus();
                          } else {
                            inputRef3.current.focus();
                          }
                        }}
                        onKeyPress={({nativeEvent}) => {
                          if (nativeEvent.key === 'Backspace') {
                            inputRef3.current.focus();
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={1}
                        style={{
                          ...styles.title,
                        }}
                        returnKeyType={'done'}
                      />
                    </View>
                  </View>

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
                      Don’t Receive An OTP?
                    </Text>
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: Colors.blue,
                          fontFamily: Fonts.RobotoSlabExtraBold,
                          fontSize: normalize(13),
                        }}>
                        {' '}
                        Resend It
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ButtonCom
                    onPress={() => {
                      // handleForgotPassword
                      // props?.navigation?.navigate('Home');
                    }}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(15)}
                    title={'CONTINUE'}
                    width={'100%'}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={forgotmodal}
            style={{width: '100%', alignSelf: 'center', margin: 0}}
            animationInTiming={800}
            animationOutTiming={1000}
            avoidKeyboard={true}
            // backdropOpacity={0.1}
            backdropColor={'#1e2633'}
            backdropOpacity={0.7}>
            <View
              style={{
                flex: 1,
                //   backgroundColor: '#FFFFFF',
                position: 'absolute',
                bottom: normalize(10),
                left: 0,
                right: 0,
                borderTopRightRadius: normalize(20),
                borderTopLeftRadius: normalize(20),
                paddingVertical: normalize(10),
                alignItems: 'center',
              }}
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
              <View style={{width: '90%', alignSelf: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    setforgotmodal(false),
                      setforgotemail(''),
                      setPinforgot1(''),
                      setPinforgot2(''),
                      setPinforgot3(''),
                      setPinforgot4(''),
                      setforgotpassword(''),
                      setforgotconfirmpassword(''),
                      setforgotstatus(0);
                  }}
                  style={{alignSelf: 'flex-end', marginBottom: normalize(12)}}>
                  <Image
                    style={{
                      width: normalize(16),
                      height: normalize(16),
                      resizeMode: 'contain',
                    }}
                    source={Icons.redcross}
                  />
                </TouchableOpacity>
                {forgotstatus == 0 ? (
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: Colors.statusbar,
                      borderRadius: normalize(15),
                      paddingTop: normalize(30),
                      paddingHorizontal: normalize(10),
                      paddingBottom: normalize(40),
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: Fonts.RobotoSlabExtraBold,
                        color: Colors.white,
                        fontSize: normalize(18),
                      }}>
                      FORGOT PASSWORD!
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: Fonts.RobotoMedium,
                        color: Colors.lightwhite,
                        fontSize: normalize(11),
                        width: '85%',
                        alignSelf: 'center',
                        marginTop: normalize(10),
                      }}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.text of the
                    </Text>

                    <TextInputItem
                      placeholder={'Email Address'}
                      isleftimage={true}
                      leftimage={Icons.email}
                      onChangeText={val => setforgotemail(val)}
                      value={forgotemail}
                      marginTop={normalize(25)}
                    />

                    <ButtonCom
                      onPress={handleForgotPassword}
                      backgroundColor={Colors.blue}
                      fontSize={normalize(11)}
                      letterSpacing={normalize(1.5)}
                      marginTop={normalize(20)}
                      title={
                        AuthReducer?.status ===
                        'Auth/forgotPasswordSendEmailRequest'
                          ? 'Sending OTP....'
                          : 'CONTINUE'
                      }
                      width={'100%'}
                    />
                  </View>
                ) : forgotstatus == 1 ? (
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: Colors.statusbar,
                      borderRadius: normalize(15),
                      paddingTop: normalize(30),
                      paddingHorizontal: normalize(10),
                      paddingBottom: normalize(40),
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: Fonts.RobotoSlabExtraBold,
                        color: Colors.white,
                        fontSize: normalize(18),
                      }}>
                      OTP VERIFICATION
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: Fonts.RobotoMedium,
                        color: Colors.lightwhite,
                        fontSize: normalize(11),
                        width: '85%',
                        alignSelf: 'center',
                        marginTop: normalize(10),
                      }}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.text of the
                    </Text>
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: normalize(15),
                      }}>
                      <View
                        style={[
                          styles.viewstyle,
                          // {
                          //   borderColor: pin1status
                          //     ? Colors.button
                          //     : Colors.bordercolor,
                          // },
                        ]}>
                        <TextInput
                          value={pinforgot1}
                          ref={inputRefforgot1}
                          onChangeText={value => {
                            setPinforgot1(value);
                            if (!pinforgot1.length > 0) {
                              inputRefforgot2.current.focus();
                            }
                          }}
                          keyboardType="numeric"
                          maxLength={1}
                          style={{
                            ...styles.title,
                          }}
                          returnKeyType={'done'}
                        />
                      </View>
                      <View style={[styles.viewstyle]}>
                        <TextInput
                          value={pinforgot2}
                          ref={inputRefforgot2}
                          onChangeText={value => {
                            setPinforgot2(value);
                            if (!pinforgot2.length > 0) {
                              inputRefforgot3.current.focus();
                            } else {
                              inputRefforgot1.current.focus();
                            }
                          }}
                          keyboardType="numeric"
                          onKeyPress={({nativeEvent}) => {
                            if (nativeEvent.key === 'Backspace') {
                              inputRefforgot1.current.focus();
                            }
                          }}
                          maxLength={1}
                          style={{
                            ...styles.title,
                          }}
                          returnKeyType={'done'}
                        />
                      </View>
                      <View style={[styles.viewstyle]}>
                        <TextInput
                          value={pinforgot3}
                          ref={inputRefforgot3}
                          onChangeText={value => {
                            setPinforgot3(value);
                            if (!pinforgot3.length > 0) {
                              inputRefforgot4.current.focus();
                            } else {
                              inputRefforgot2.current.focus();
                            }
                          }}
                          keyboardType="numeric"
                          onKeyPress={({nativeEvent}) => {
                            if (nativeEvent.key === 'Backspace') {
                              inputRefforgot2.current.focus();
                            }
                          }}
                          maxLength={1}
                          style={{
                            ...styles.title,
                          }}
                          returnKeyType={'done'}
                        />
                      </View>
                      <View style={[styles.viewstyle]}>
                        <TextInput
                          value={pinforgot4}
                          ref={inputRefforgot4}
                          onChangeText={value => {
                            setPinforgot4(value);
                            if (!pinforgot4.length > 0) {
                              inputRefforgot4.current.focus();
                            } else {
                              inputRefforgot3.current.focus();
                            }
                          }}
                          onKeyPress={({nativeEvent}) => {
                            if (nativeEvent.key === 'Backspace') {
                              inputRefforgot3.current.focus();
                            }
                          }}
                          keyboardType="numeric"
                          maxLength={1}
                          style={{
                            ...styles.title,
                          }}
                          returnKeyType={'done'}
                        />
                      </View>
                    </View>

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
                        Don’t Receive An OTP?
                      </Text>
                      <TouchableOpacity onPress={handleResendOtp}>
                        <Text
                          style={{
                            color: Colors.blue,
                            fontFamily: Fonts.RobotoSlabExtraBold,
                            fontSize: normalize(13),
                          }}>
                          {' '}
                          {AuthReducer?.status === 'Auth/resendOtpRequest'
                            ? 'Resending.....'
                            : ' Resend It'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <ButtonCom
                      onPress={handleVerifyOtp}
                      backgroundColor={Colors.blue}
                      fontSize={normalize(11)}
                      letterSpacing={normalize(1.5)}
                      marginTop={normalize(20)}
                      title={
                        AuthReducer?.status === 'Auth/otpverificationRequest'
                          ? 'Validating....'
                          : 'CONTINUE'
                      }
                      width={'100%'}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: Colors.statusbar,
                      borderRadius: normalize(15),
                      paddingTop: normalize(30),
                      paddingHorizontal: normalize(10),
                      paddingBottom: normalize(40),
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: Fonts.RobotoSlabExtraBold,
                        color: Colors.white,
                        fontSize: normalize(18),
                      }}>
                      CREATE NEW PASSWORD
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: Fonts.RobotoMedium,
                        color: Colors.lightwhite,
                        fontSize: normalize(11),
                        width: '85%',
                        alignSelf: 'center',
                        marginTop: normalize(10),
                      }}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.text of the
                    </Text>

                    <TextInputItem
                      placeholder={'Password'}
                      isleftimage={true}
                      leftimage={Icons.password}
                      onChangeText={val => setforgotpassword(val)}
                      value={forgotpassword}
                      isSecure={forgotpassshow}
                      isrightimage={true}
                      rightimagepress={() => setforgotpassshow(!forgotpassshow)}
                      showhide={forgotpassshow}
                    />
                    <TextInputItem
                      placeholder={'Confirm Password'}
                      isleftimage={true}
                      leftimage={Icons.password}
                      onChangeText={val => setforgotconfirmpassword(val)}
                      value={forgotconfirmpassword}
                      isSecure={forgotconfirmpassshow}
                      isrightimage={true}
                      rightimagepress={() =>
                        setforgotconfirmpassshow(!forgotconfirmpassshow)
                      }
                      showhide={forgotconfirmpassshow}
                    />

                    <ButtonCom
                      onPress={handleChangePassword}
                      backgroundColor={Colors.blue}
                      fontSize={normalize(11)}
                      letterSpacing={normalize(1.5)}
                      marginTop={normalize(20)}
                      title={
                        AuthReducer?.status === 'Auth/forgotpasswordRequest'
                          ? 'Resetting....'
                          : 'RESET PASSWORD'
                      }
                      width={'100%'}
                    />
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  viewstyle: {
    height: normalize(60),
    width: normalize(60),
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1.5,
    borderRadius: normalize(8),
    backgroundColor: Colors.inputbackgroundcolor,
  },
  title: {
    height: normalize(60),
    width: normalize(60),
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: normalize(20),
    color: Colors.white,
    fontFamily: Fonts.RobotoMedium,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
