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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  brandItemListRequest,
  brandListRequest,
} from '../../redux/reducer/AuthReducer';
import constants from '../../utils/helpers/constants';
import Loader from '../../utils/helpers/Loader';
import { setBrandInfo } from '../../redux/action/userActions';
import {connect} from 'react-redux';

const  Selectbrand=({brandInfo,setBrandInfo})=>{
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  let status = '';
  const navigation=useNavigation();
 

  useEffect(() => {
    dispatch(
      brandListRequest({
        page: 1,
        perpage: 100,
      }),
    );
  }, [isFocus]);

  useEffect(() => {
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/brandItemListRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/brandItemListSuccess':
          status = AuthReducer.status;
         navigation?.navigate('Selectstickers');
          break;
        case 'Auth/brandItemListFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);



  function renderdata({item, index}) {
    return (
      <TouchableOpacity
        onPress={() =>{
          dispatch(
            brandItemListRequest({
              page: 1,
              perpage:100,
              brand_id: item?._id,
            }),
          )
          setBrandInfo({ brand_id: item._id });
        }
        }
        style={{
          width: normalize(125),
          height: normalize(80),
          backgroundColor: Colors.white,
          marginTop: normalize(15),
          borderRadius: normalize(10),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{uri: constants?.IMAGE_URL + 'brand/' + item?.brand_logo}}
          style={{
            width: normalize(70),
            height: normalize(40),
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
      <Loader visible={AuthReducer?.status === 'Auth/brandItemListRequest'} />
      <MyStatusBar backgroundColor={Colors.statusbar} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <SafeAreaView
          style={{height: '100%', width: '90%', alignSelf: 'center'}}>
          <TouchableOpacity
            onPress={() =>navigation?.goBack()}
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
              style={{width: '100%', height: '100%',top:
              Platform.OS === 'ios'
                ? Dimensions.get('window').height > 736
                  ? normalize(10)
                  : normalize(8)
                : normalize(15),}}
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
                    textTransform: 'uppercase',
                  }}>
                  Choose Stickers
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(10.5),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                    marginTop: normalize(10),
                    textTransform: 'capitalize',
                  }}>{`Select the brand(s) you’d like to drive for`}</Text>
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{
                    paddingBottom: normalize(30),
                    //    marginTop:normalize(10)
                  }}
                  data={
                    AuthReducer?.brandListResponse?.data?.length > 0
                      ? AuthReducer?.brandListResponse?.data
                      : []
                  }
                  style={{width: '100%'}}
                  key={2}
                  numColumns={2}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderdata}
                  horizontal={false}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                />
              </ScrollView>
            </ImageBackground>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
const mapStateTonavigation = state => ({
  brandInfo: state.user.brandInfo,
});

const mapDispatchTonavigation = {
  setBrandInfo,
};

export default connect(
  mapStateTonavigation,
  mapDispatchTonavigation,
)(Selectbrand);