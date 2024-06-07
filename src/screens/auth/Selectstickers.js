import React, {useRef, useState, useEffect, useDebugValue} from 'react';

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
  FlatList,
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
import {useDispatch, useSelector} from 'react-redux';
import constants from '../../utils/helpers/constants';
import {connect} from 'react-redux';
import {setStickerInfo} from '../../redux/action/userActions';
import {useNavigation} from '@react-navigation/native';
import Toast from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import {signUpResponseRequest} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
const Selectstickers = ({
  stickerInfo,
  setStickerInfo,
  personalInfo,
  vehicleInfo,
  brandInfo,
  carInfo,
  addressInfo,
}) => {
  const AuthReducer = useSelector(state => state.AuthReducer);
  const navigation = useNavigation();
  const [selectedStickers, setSelectedStickers] = useState([]);
  const dispatch = useDispatch();

  const [select, setselect] = useState(0);
  function selectfunction(index) {
    let arr = AuthReducer?.brandItemListResponse?.data?.map((item, i) => {
      if (i === index) {
        return {...item};
      }
      return item;
    });
    const selectedItem = arr[index];
    const isSelected = selectedStickers.some(
      item => item._id === selectedItem._id,
    );
    if (isSelected) {
      setSelectedStickers(
        selectedStickers.filter(item => item._id !== selectedItem._id),
      );
      setselect(select - 1);
    } else {
      setSelectedStickers([...selectedStickers, selectedItem]);
      setselect(select + 1);
    }
    const selectedStickerIds = selectedStickers.map(item => item._id);
    setStickerInfo({sticker_id: selectedStickerIds});
  }

  const HandleSignUp = () => {
    const selectedStickerIds = selectedStickers.map(item => item._id);
    if (select === 0) {
      Toast('Please select sticker');
    } else {
      let obj = new FormData();
      obj.append('first_name', personalInfo?.firstName);
      obj.append('last_name', personalInfo?.lastName);
      obj.append('email', personalInfo?.email);
      obj.append('password', personalInfo?.password);
      // obj.append('car_id', carInfo?.carId);
      // obj.append('model_number', carInfo?.modelNumber);
      // obj.append('car_model_id', carInfo?.modelId);
      obj.append('vin_number', carInfo?.vinNumber);
      // obj.append('number_of_doors', Number(carInfo?.totalDoors));
      obj.append('license_number', carInfo?.licenseNumber);
      obj.append('driving_license_document', vehicleInfo?.uploadDrivingLicense);
      obj.append('government_id_document', vehicleInfo?.uploadGovtIdCard);
      obj.append('car_image', vehicleInfo?.uploadCarImage);
      obj.append('vin_number_car_document', vehicleInfo?.uploadVinNumberCar);
      obj.append('address', addressInfo?.address);
      obj.append('city', addressInfo?.city);
      obj.append('state', addressInfo?.state);
      obj.append('zipcode', addressInfo?.zipcode);
      obj.append('brand_id', brandInfo?.brand_id);
      if (selectedStickerIds?.length > 0) {
        selectedStickerIds.map((item, index) => {
          obj.append(`sticker_id[${index}]`, item);
        });
      }

      console.log(obj, '>>>?????');
      // return
      connectionrequest()
        .then(() => {
          dispatch(signUpResponseRequest(obj));
        })
        .catch(err => {
          console.log(err);
        });
      // connectionrequest()
      // then(()=>{
      //   dispatch(signUpResponseRequest(obj));
      // }).catch((error)=>{
      //   console.log(error)
      // })
    }
  };

  let status = '';
  useEffect(() => {
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/signUpResponseRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/signUpResponseSuccess':
          status = AuthReducer.status;
          navigation?.navigate('Signin');
          break;
        case 'Auth/signUpEmailExistFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);

  function renderdata({item, index}) {
    const isSelected = selectedStickers.some(
      selectedItem => selectedItem._id === item._id,
    );
    return (
      <TouchableOpacity
        onPress={() => selectfunction(index)}
        style={{
          width: normalize(125),
          height: normalize(90),
          backgroundColor: Colors.white,
          marginTop: normalize(15),
          borderRadius: normalize(10),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-between',
            top: normalize(7),
            width: '85%',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity>
            <Image
              source={Icons.information}
              style={{
                width: normalize(13),
                height: normalize(13),
                tintColor: Colors.blue,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectfunction(index)}
            style={{
              width: normalize(14),
              height: normalize(14),
              borderWidth: 1,
              borderColor: Colors.black,
              borderRadius: normalize(4),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {isSelected && (
              <Image
                source={Icons.tick}
                style={{
                  width: normalize(7),
                  height: normalize(7),
                  resizeMode: 'contain',
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: constants?.IMAGE_URL + 'sticker/' + item?.sticker_thumbnail,
          }}
          style={{
            width: normalize(70),
            height: normalize(50),
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    );
  }

  return (
    <ImageBackground
      style={{width: '100%', height: '100%', position: 'absolute'}}
      resizeMode="stretch"
      source={Icons.SignIn}>
      <Loader visible={AuthReducer?.status === 'Auth/signUpResponseRequest'} />
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
                  borderRadius: normalize(65),
                  overflow: 'visible',
                  // position: 'absolute',
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
                  // marginTop: normalize(120),
                  paddingHorizontal: normalize(10),
                }}
                showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoSlabExtraBold,
                    color: Colors.white,
                    fontSize: normalize(17),
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}>{`${select}/${
                  AuthReducer?.brandItemListResponse?.data?.length > 5
                    ? 5
                    : AuthReducer?.brandItemListResponse?.data?.length
                }`}</Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(12),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                    marginTop: normalize(10),
                    textTransform: 'capitalize',
                  }}>{`Select up to 5 sticker designs`}</Text>
                {AuthReducer?.brandItemListResponse?.data?.length > 0 ? (
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{
                      paddingBottom: normalize(10),
                      //    marginTop:normalize(10)
                    }}
                    data={AuthReducer?.brandItemListResponse?.data}
                    style={{width: '100%'}}
                    key={2}
                    numColumns={2}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderdata}
                    horizontal={false}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                  />
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      marginVertical: normalize(20),
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(12),
                        fontFamily: Fonts.RobotoMedium,
                        color: Colors.lightwhite,
                      }}>
                      No Sticker Found
                    </Text>
                  </View>
                )}
                {/* HandleSignUp */}
                {AuthReducer?.brandItemListResponse?.data?.length > 0 ? (
                  <ButtonCom
                    onPress={HandleSignUp}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(10)}
                    title={'SUBMIT'}
                    width={'100%'}
                  />
                ) : (
                  <ButtonCom
                    onPress={() => navigation?.goBack()}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(10)}
                    title={'Go Back'}
                    width={'100%'}
                  />
                )}
              </ScrollView>
            </ImageBackground>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const mapStateTonavigation = state => ({
  stickerInfo: state.user.stickerInfo,
  brandInfo: state?.user?.brandInfo,
  personalInfo: state?.user?.personalInfo,
  carInfo: state?.user?.carInfo,
  vehicleInfo: state?.user?.vehicleInfo,
  addressInfo: state?.user?.addressInfo,
});

const mapDispatchTonavigation = {
  setStickerInfo,
};

export default connect(
  mapStateTonavigation,
  mapDispatchTonavigation,
)(Selectstickers);
