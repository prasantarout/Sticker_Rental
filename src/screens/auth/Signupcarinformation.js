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
  Dimensions,
  Platform,
} from 'react-native';
import {Colors, Fonts, Icons} from '../../themes/ImagePath';
import MyStatusBar from '../../utils/MyStatusBar';
import normalize from '../../utils/helpers/dimen';
import ButtonCom from '../../components/ButtonCom';
import Modal from 'react-native-modal';
import TextInputItem from '../../components/TextInput';
import {setCarInfo} from '../../redux/action/userActions';
import {connect, useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Toast from '../../utils/helpers/Toast';
import {
  checkVinAndLicenseRequest,
  getCarListRequest,
  vehicleModelListRequest,
  vehicleModelListSuccess,
} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
import {Dropdown} from 'react-native-element-dropdown';

const Signupcarinformation = ({carInfo, setCarInfo}) => {
  const AuthReducer = useSelector(state => state.AuthReducer);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [value, setValue] = useState(null);
  const [doorvalue, setDoorValue] = useState(null);

  const [value1, setValue1] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const handleInputChange = (field, text) => {
    setCarInfo({...carInfo, [field]: text});
  };

  console.log(carInfo, '>>>>>>>>>>resss');

  const validateCarInformation = () => {
    // if (carInfo?.carName === '') {
    //   Toast('Please select your car name');
    //   return;
    // }
    // if (carInfo?.modelNumber === '') {
    //   Toast('Please select your model name');
    //   return;
    // }
    if (carInfo?.vinNumber === '') {
      Toast('Please enter your vin number');
      return;
    }
    if (carInfo?.vinNumber === carInfo?.licenseNumber) {
      Toast(
        'VIN number and License number should not be the same,they must be unique.',
      );
      return;
    }
    if (carInfo?.licenseNumber === '') {
      Toast('Please enter your license number');
      return;
    }
    // if (carInfo?.totalDoors === '') {
    //   Toast('Please enter your car total doors');
    //   return;
    // }
    // if (carInfo?.totalDoors < 1) {
    //   Toast('Car doors should not less than 1');
    //   return;
    // } 
    else {
      let obj = {
        vin_number: carInfo?.vinNumber,
        license_number: carInfo?.licenseNumber,
      };
      dispatch(checkVinAndLicenseRequest(obj));
    }
  };

  useEffect(() => {
    dispatch(
      getCarListRequest({
        page: 1,
        perpage: 100,
      }),
    );
  }, []);

  let status = '';
  useEffect(() => {
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/checkVinAndLicenseRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/checkVinAndLicenseSuccess':
          status = AuthReducer.status;
          navigation?.navigate('Carrecognize');
          break;
        case 'Auth/checkVinAndLicenseFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);

  const data = [
    {label: '2', value: '2'},
    {label: '4', value: '4'},
  ];

  return (
    <ImageBackground
      style={{width: '100%', height: '100%', position: 'absolute'}}
      resizeMode="stretch"
      source={Icons.SignIn}>
      <Loader
        visible={AuthReducer?.status === 'Auth/checkVinAndLicenseRequest'}
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
                marginTop:normalize(27),
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
                  source={Icons.l1}
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
                {/* <View style={styles.dropdown_container}>
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
                      AuthReducer?.cardListRes?.data?.length > 0
                        ? AuthReducer?.cardListRes?.data
                        : []
                    }
                    // search
                    maxHeight={300}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    labelField="car_name"
                    valueField="_id"
                    placeholder="Select Car"
                    searchPlaceholder="Search..."
                    value={value}
                    onChange={item => {
                      console.log(item, '>>>>>>Resssasa');
                      setCarInfo({
                        ...carInfo,
                        carName: item.car_name,
                        carId: item._id,
                      });
                      // handleInputChange('carId', item._id);
                      dispatch(
                        vehicleModelListRequest({
                          page: 1,
                          perpage: 100,
                          car_id: item?._id,
                        }),
                      );
                    }}
                  />
                </View> */}
                {/* <TextInputItem
                  placeholder={'Model Number'}
                  // isleftimage={true}
                  // leftimage={Icons.email}
                  value={carInfo.modelNumber || ''}
                  onChangeText={text => handleInputChange('modelNumber', text)}
                  // marginTop={normalize(40)}
                /> */}
                {/* <View style={styles.dropdown_container}>
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
                      AuthReducer?.vehicleModelListRes?.data?.length > 0
                        ? AuthReducer?.vehicleModelListRes?.data
                        : []
                    }
                    // search
                    maxHeight={300}
                    onFocus={() => setIsFocus1(true)}
                    onBlur={() => setIsFocus1(false)}
                    labelField="model_name"
                    valueField="car_id"
                    placeholder="Select Model Name"
                    searchPlaceholder="Search..."
                    value={value1}
                    onChange={item => {
                      console.log(item, '>>>???Sssss');
                      setCarInfo({
                        ...carInfo,
                        modelNumber: item.model_name,
                        modelId: item._id,
                      });
                      // handleInputChange('modelId', item._id);
                      setValue1(item);
                      // setValue(item.value);
                    }}
                  />
                </View> */}

                <TextInputItem
                  placeholder={'Vin Number'}
                  // isleftimage={true}
                  // leftimage={Icons.password}
                  value={carInfo.vinNumber || ''}
                  onChangeText={text => handleInputChange('vinNumber', text)}
                  // isSecure={passshow}
                  // isrightimage={true}
                  // rightimagepress={() => setpassshow(!passshow)}
                  // showhide={passshow}
                />
                <TextInputItem
                  placeholder={'License Number'}
                  // isleftimage={true}
                  // leftimage={Icons.email}
                  value={carInfo.licenseNumber || ''}
                  onChangeText={text =>
                    handleInputChange('licenseNumber', text)
                  }
                  // marginTop={normalize(40)}suzuki
                />
                {/* <View style={styles.dropdown_container}>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: isFocus2 ? 0 : 10,
                        borderBottomRightRadius: isFocus2 ? 0 : 10,
                      },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    activeColor={Colors.statusbar}
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
                    data={data}
                    // search
                    maxHeight={300}
                    onFocus={() => setIsFocus2(true)}
                    onBlur={() => setIsFocus2(false)}
                    labelField="label"
                    valueField="value"
                    placeholder="Select the number of doors"
                    searchPlaceholder="Search..."
                    value={carInfo?.totalDoors}
                    onChange={item => {
                      handleInputChange('totalDoors', item?.value);
                      setDoorValue(item.value);
                    }}
                  />
                </View> */}
                {/* <TextInputItem
                  placeholder={'How Many Doors This Car Have'}
                  // isleftimage={true}
                  // leftimage={Icons.password}
                  value={carInfo.totalDoors || ''}
                  onChangeText={text => handleInputChange('totalDoors', text)}
                  // isSecure={confirmpassshow}
                  // isrightimage={true}
                  // rightimagepress={() => setconfirmpassshow(!confirmpassshow)}
                  // showhide={confirmpassshow}
                /> */}

                {/* <Buttonfield
                  placeholder={'Car Name'}
                  isleftimage={true}
                  leftimage={Icons.email}
                  onChangeText={val => setcarname(val)}
                  value={carname}
                  editable={false}
                  marginTop={normalize(15)}
                  isrightimage={true}
                  rightimagepress={() => {}}
                  informationpress={() => {}}
                />
                <Buttonfield
                  placeholder={'Model Number'}
                  isleftimage={true}
                  leftimage={Icons.email}
                  onChangeText={val => setmodelnumber(val)}
                  value={modelnumber}
                  editable={false}
                  marginTop={normalize(15)}
                  isrightimage={true}
                  rightimagepress={() => {}}
                  informationpress={() => {}}
                />
                <Buttonfield
                  placeholder={'Vin Number'}
                  isleftimage={true}
                  leftimage={Icons.email}
                  onChangeText={val => setvinnumber(val)}
                  value={vinnumber}
                  editable={false}
                  marginTop={normalize(15)}
                  isrightimage={true}
                  rightimagepress={() => {}}
                  informationpress={() => {}}
                />
                <Buttonfield
                  placeholder={'How Many Doors This Car Have'}
                  isleftimage={true}
                  leftimage={Icons.email}
                  onChangeText={val => setdoors(val)}
                  value={doors}
                  editable={false}
                  marginTop={normalize(15)}
                  isrightimage={true}
                  rightimagepress={() => {}}
                  informationpress={() => {}}
                /> */}
                <ButtonCom
                  onPress={validateCarInformation}
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
        {/* </View> */}
      </SafeAreaView>
      {/* </KeyboardAvoidingView> */}
    </ImageBackground>
  );
};

const mapStateTonavigation = state => ({
  carInfo: state.user.carInfo,
});

const mapDispatchTonavigation = {
  setCarInfo,
};

export default connect(
  mapStateTonavigation,
  mapDispatchTonavigation,
)(Signupcarinformation);

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
