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
import ButtonCom from '../../components/ButtonCom';
import Modal from 'react-native-modal';
import Buttonfield from '../../components/Buttonfield';
import TextInputItem from '../../components/TextInput';
import {setAddressInfo} from '../../redux/action/userActions';
import {connect, useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  cityListRequest,
  signUpEmailExistRequest,
  stateListRequest,
} from '../../redux/reducer/AuthReducer';
import Toast from '../../utils/helpers/Toast';
import {Dropdown} from 'react-native-element-dropdown';
let status;

const Signupaddress = ({addressInfo, setAddressInfo}) => {
  const navigation = useNavigation();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const UserReducer=useSelector(state=>state.user)

  const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [value, setValue] = useState(null);
  const [cityValue, setCityValue] = useState(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const handleInputChange = (field, text) => {
    setAddressInfo({...addressInfo, [field]: text});
  };
  const validateZipcode = zipcode => {
    // Check if the zipcode is a valid numeric string
    var regex = /^[0-9]+$/;
    if (!regex.test(zipcode)) {
      Toast('Please enter a valid numeric zip code');
      return;
    }
  };

  const handleAddressInformation = () => {
    if (addressInfo?.address === '') {
      Toast('Please enter your address');
      return;
    }
    if (addressInfo?.city == '') {
      Toast('Please enter your city');
      return;
    }
    if (addressInfo?.state === '') {
      Toast('Please enter your state');
      return;
    }
    if (addressInfo?.zipcode == '') {
      Toast('Please enter your zipcode');
      return;
    } else {
      navigation?.navigate('Selectbrand');
    }
  };

  useEffect(() => {
    dispatch(stateListRequest());
  }, [isFocused]);
// console.log("jsahdjashdj", ?.user)
  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/cityListRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/cityListSuccess':
        status = AuthReducer.status;
        handleInputChange('city', AuthReducer?.cityListRes?.data?.[0]?.name);
        break;
      case 'Auth/cityListFailure':
        status = AuthReducer.status;
        break;
    }
  }
  // navigation?.navigate('Selectbrand')
  return (
    <ImageBackground
      style={{width: '100%', height: '100%', position: 'absolute'}}
      resizeMode="stretch"
      source={Icons.SignIn}>
      <MyStatusBar backgroundColor={Colors.statusbar} />
        <SafeAreaView
          style={{height: '100%', width: '90%', alignSelf: 'center'}}>
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
                marginTop:
                  Platform.OS === 'ios'
                    ? Dimensions.get('window').height > 736
                      ? normalize(30)
                      : normalize(25)
                    : normalize(25),
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
                  source={Icons.l3}
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
                  Shipping Address
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(10),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                    marginTop: normalize(10),
                    width: '80%',
                    alignSelf: 'center',
                  }}>
                  Your Shipping Address Will Be Securelystored And Only Used For
                  Sending STIC Materials.
                </Text>
                <TextInputItem
                  placeholder={'Address'}
                  isleftimage={false}
                  leftimage={Icons.email}
                  value={addressInfo.address || ''}
                  onChangeText={text => handleInputChange('address', text)}
                  marginTop={normalize(15)}
                />
                <View style={styles.dropdown_container}>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: isFocus ? 0 : 10,
                        borderBottomRightRadius: isFocus ? 0 : 10,
                      },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    activeColor={Colors.statusbar}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={{
                      color: Colors.lightwhite,
                      fontWeight: '500',
                    }}
                    containerStyle={{
                      backgroundColor: Colors.idback,
                      borderColor: 'none',
                      borderWidth: 1,
                      borderColor: Colors.idback,
                    }}
                    data={
                      AuthReducer?.stateListRes?.data?.length > 0
                        ? AuthReducer?.stateListRes?.data
                        : []
                    }
                    // search
                    maxHeight={300}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    labelField="name"
                    valueField="isoCode"
                    placeholder={
                      UserReducer?.addressInfo?.state ? UserReducer?.addressInfo?.state: 'Select State'
                    }
                    searchPlaceholder="Search..."
                    value={value}
                    onChange={item => {
                      handleInputChange('state', item.name);
                      dispatch(
                        cityListRequest({
                          isoCode: item?.isoCode,
                          countryCode: item?.countryCode,
                        }),
                      );
                    }}
                  />
                </View>
                <View style={styles.dropdown_container}>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: isFocus1 ? 0 : 10,
                        borderBottomRightRadius: isFocus1 ? 0 : 10,
                      },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    activeColor={Colors.statusbar}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={{
                      color: Colors.lightwhite,
                      fontWeight: '500',
                    }}
                    containerStyle={{
                      backgroundColor: Colors.idback,
                      borderColor: 'none',
                      borderWidth: 1,
                      borderColor: Colors.idback,
                    }}
                    data={
                      AuthReducer?.cityListRes?.data?.length > 0
                        ? AuthReducer?.cityListRes?.data
                        : []
                    }
                    // search
                    maxHeight={300}
                    onFocus={() => setIsFocus1(true)}
                    onBlur={() => setIsFocus1(false)}
                    labelField="name"
                    valueField="isoCode"
                    placeholder="Select City"
                    searchPlaceholder="Search..."
                    value={cityValue}
                    onChange={item => {
                      handleInputChange('city', item.name);
                    }}
                  />
                </View>
                {/* <TextInputItem
                  placeholder={'State'}
                  isleftimage={false}
                  leftimage={Icons.email}
                  value={addressInfo.state || ''}
                  onChangeText={text => handleInputChange('state', text)}
                  marginTop={normalize(15)}
                /> */}
                {/* <TextInputItem
                  placeholder={'City'}
                  isleftimage={false}
                  leftimage={Icons.email}
                  value={addressInfo.city || ''}
                  onChangeText={text => handleInputChange('city', text)}
                  marginTop={normalize(15)}
                /> */}

                {/* <Buttonfield
                  placeholder={'City'}
                  isleftimage={false}
                  leftimage={Icons.email}
                  onChangeText={val => setcity(val)}
                  value={city}
                  editable={false}
                  marginTop={normalize(15)}
                  isrightimage={true}
                  rightimagepress={() => {}}
                  informationpress={() => {}}
                /> */}
                {/* <Buttonfield
                  placeholder={'State'}
                  isleftimage={false}
                  leftimage={Icons.email}
                  onChangeText={val => setstate(val)}
                  value={state}
                  editable={false}
                  marginTop={normalize(15)}
                  isrightimage={true}
                  rightimagepress={() => {}}
                  informationpress={() => {}}
                /> */}
                <TextInputItem
                  placeholder={'Zipcode'}
                  isleftimage={false}
                  leftimage={Icons.email}
                  value={addressInfo.zipcode || ''}
                  onChangeText={text => handleInputChange('zipcode', text)}
                  marginTop={normalize(15)}
                />
                <ButtonCom
                  onPress={handleAddressInformation}
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

const mapStateTonavigation = state => ({
  addressInfo: state.user.addressInfo,
});

const mapDispatchTonavigation = {
  setAddressInfo,
};

export default connect(
  mapStateTonavigation,
  mapDispatchTonavigation,
)(Signupaddress);

const styles = StyleSheet.create({
  dropdown: {
    height: normalize(55),
    width: '100%',
    padding: normalize(11),
    backgroundColor: Colors.inputbackgroundcolor,
    marginTop: normalize(15),
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.lightwhite,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.lightwhite,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdown_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
