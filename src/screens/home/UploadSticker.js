import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import MyStatusBar from '../../utils/MyStatusBar';
import {ImageBackground} from 'react-native';
import {Colors, Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import Modal from 'react-native-modal';
import ButtonCom from '../../components/ButtonCom';
import {
  brandItemListRequest,
  brandListRequest,
  myStickerRemoveRequest,
  myStickerUpdateRequest,
  myStickerViewRequest,
  profileRequest,
} from '../../redux/reducer/AuthReducer';
import {useDispatch, useSelector} from 'react-redux';
import constants from '../../utils/helpers/constants';
import Loader from '../../utils/helpers/Loader';
import {useNavigation} from '@react-navigation/native';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import ImageCropPicker from 'react-native-image-crop-picker';

export default function UploadSticker(props) {
  const AuthReducer = useSelector(state => state.AuthReducer);
  console.log(AuthReducer?.myStickerViewResponse?.data, '>>>>>>>>>ress');
  console.log(AuthReducer?.profileResponse, '>>>>>>>>Repsiosns');
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [bonnet, setBonnet] = useState('');
  const [front, setFront] = useState('');
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  useEffect(() => {
    dispatch(
      brandListRequest({
        page: 1,
        perpage: 100,
      }),
    );
    dispatch(myStickerViewRequest());
    dispatch(profileRequest());
  }, []);

  function btnClick_cameraUpload() {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(response => {
        let imageObj = {};
        //console.log(response);

        imageObj.name = response.filename
          ? response.filename
          : response.path.replace(/^.*[\\\/]/, '');
        imageObj.type = response.mime;
        imageObj.uri = response.path;
        setBonnet(imageObj);
        console.log(imageObj);
      })
      .catch(err => console.log(err));
  }
  function btnClick_cameraUpload_front() {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(response => {
        let imageObj = {};
        //console.log(response);

        imageObj.name = response.filename
          ? response.filename
          : response.path.replace(/^.*[\\\/]/, '');
        imageObj.type = response.mime;
        imageObj.uri = response.path;
        setFront(imageObj);
        console.log(imageObj);
      })
      .catch(err => console.log(err));
  }
  function btnClick_cameraUpload_right() {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(response => {
        let imageObj = {};
        //console.log(response);

        imageObj.name = response.filename
          ? response.filename
          : response.path.replace(/^.*[\\\/]/, '');
        imageObj.type = response.mime;
        imageObj.uri = response.path;
        setRight(imageObj);
        console.log(imageObj);
      })
      .catch(err => console.log(err));
  }
  function btnClick_cameraUpload_left() {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(response => {
        let imageObj = {};
        //console.log(response);

        imageObj.name = response.filename
          ? response.filename
          : response.path.replace(/^.*[\\\/]/, '');
        imageObj.type = response.mime;
        imageObj.uri = response.path;
        setLeft(imageObj);
        console.log(imageObj);
      })
      .catch(err => console.log(err));
  }

  return (
    <Fragment>
      <MyStatusBar />
      <Loader visible={AuthReducer?.status === 'Auth/brandItemListRequest'} />
      <ImageBackground style={{flex: 1}} source={Icons.Profileback}>
        <View style={{width: '90%', alignSelf: 'center'}}>
          <TouchableOpacity
            onPress={() => props?.navigation?.goBack()}
            style={{
              marginTop:
                Platform.OS == 'android' ? normalize(50) : normalize(10),
              width: normalize(40),
              height: normalize(15),
            }}>
            <Image
              source={Icons.backicon}
              style={{
                width: normalize(15),
                height: normalize(15),
                resizeMode: 'stretch',
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: Fonts.RobotoSlabBold,
              fontSize: normalize(15),
              color: Colors.white,
              textAlign: 'center',
            }}>
            Upload Sticker
          </Text>
        </View>
        <ScrollView
          style={{backgroundColor: Colors.statusbar, marginTop: normalize(30)}}
          contentContainerStyle={{
            paddingTop: normalize(15),
            paddingBottom: normalize(30),
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(15),
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => btnClick_cameraUpload()}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                width: normalize(130),
                height: normalize(125),
                borderRadius: normalize(12),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {bonnet == '' ? (
                <Image
                  source={Icons.camera}
                  style={{
                    width: normalize(45),
                    height: normalize(45),
                    resizeMode: 'contain',
                  }}
                />
              ) : (
                <View>
                  <Image
                    source={{uri: bonnet?.uri}}
                    style={{
                      width: normalize(105),
                      height: normalize(85),
                      resizeMode: 'stretch',
                      borderRadius: normalize(10),
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setBonnet('')}
                    style={{
                      position: 'absolute',
                      right: -normalize(6),
                      top: -normalize(6),
                    }}>
                    <Image
                      source={Icons.redcross}
                      style={{
                        width: normalize(12),
                        height: normalize(12),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {bonnet == '' ? (
                <Text
                  style={{
                    fontFamily: Fonts.RobotoMedium,
                    fontSize: normalize(10),
                    color: Colors.white,
                    textAlign: 'center',
                    marginTop: normalize(10),
                    width: '80%',
                    //   lineHeight: normalize(18),
                  }}>
                  Upload Bonnet Image
                </Text>
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => btnClick_cameraUpload_front()}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                width: normalize(130),
                height: normalize(125),
                borderRadius: normalize(12),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {front == '' ? (
                <Image
                  source={Icons.camera}
                  style={{
                    width: normalize(45),
                    height: normalize(45),
                    resizeMode: 'contain',
                  }}
                />
              ) : (
                <View>
                  <Image
                    source={{uri: front?.uri}}
                    style={{
                      width: normalize(105),
                      height: normalize(85),
                      resizeMode: 'stretch',
                      borderRadius: normalize(10),
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setFront('')}
                    style={{
                      position: 'absolute',
                      right: -normalize(6),
                      top: -normalize(6),
                    }}>
                    <Image
                      source={Icons.redcross}
                      style={{
                        width: normalize(12),
                        height: normalize(12),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {front == '' ? (
                <Text
                  style={{
                    fontFamily: Fonts.RobotoMedium,
                    fontSize: normalize(10),
                    color: Colors.white,
                    textAlign: 'center',
                    marginTop: normalize(10),
                    width: '80%',
                    //   lineHeight: normalize(18),
                  }}>
                  Upload Front Image
                </Text>
              ) : null}
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(15),
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => btnClick_cameraUpload_left()}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                width: normalize(130),
                height: normalize(125),
                borderRadius: normalize(12),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {left == '' ? (
                <Image
                  source={Icons.camera}
                  style={{
                    width: normalize(45),
                    height: normalize(45),
                    resizeMode: 'contain',
                  }}
                />
              ) : (
                <View>
                  <Image
                    source={{uri: left?.uri}}
                    style={{
                      width: normalize(105),
                      height: normalize(85),
                      resizeMode: 'stretch',
                      borderRadius: normalize(10),
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setLeft('')}
                    style={{
                      position: 'absolute',
                      right: -normalize(6),
                      top: -normalize(6),
                    }}>
                    <Image
                      source={Icons.redcross}
                      style={{
                        width: normalize(12),
                        height: normalize(12),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {left == '' ? (
                <Text
                  style={{
                    fontFamily: Fonts.RobotoMedium,
                    fontSize: normalize(10),
                    color: Colors.white,
                    textAlign: 'center',
                    marginTop: normalize(10),
                    width: '80%',
                    //   lineHeight: normalize(18),
                  }}>
                  Upload Left Image
                </Text>
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => btnClick_cameraUpload_right()}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                width: normalize(130),
                height: normalize(125),
                borderRadius: normalize(12),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {right == '' ? (
                <Image
                  source={Icons.camera}
                  style={{
                    width: normalize(45),
                    height: normalize(45),
                    resizeMode: 'contain',
                  }}
                />
              ) : (
                <View>
                  <Image
                    source={{uri: right?.uri}}
                    style={{
                      width: normalize(105),
                      height: normalize(85),
                      resizeMode: 'stretch',
                      borderRadius: normalize(10),
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setRight('')}
                    style={{
                      position: 'absolute',
                      right: -normalize(6),
                      top: -normalize(6),
                    }}>
                    <Image
                      source={Icons.redcross}
                      style={{
                        width: normalize(12),
                        height: normalize(12),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {right == '' ? (
                <Text
                  style={{
                    fontFamily: Fonts.RobotoMedium,
                    fontSize: normalize(10),
                    color: Colors.white,
                    textAlign: 'center',
                    marginTop: normalize(10),
                    width: '80%',
                    //   lineHeight: normalize(18),
                  }}>
                  Upload Right Image
                </Text>
              ) : null}
            </TouchableOpacity>
          </View>
          <ButtonCom
            // onPress={
            //   () => signinfunction()
            //   // settwofactor(true)
            // }
            backgroundColor={Colors.blue}
            fontSize={normalize(11)}
            letterSpacing={normalize(1.5)}
            marginTop={normalize(30)}
            title={'SUBMIT'}
            width={'90%'}
            alignSelf={'center'}
          />
        </ScrollView>
      </ImageBackground>
    </Fragment>
  );
}
