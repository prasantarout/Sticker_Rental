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

export default function Mysticker(props) {
  const AuthReducer = useSelector(state => state.AuthReducer);
  console.log(AuthReducer?.myStickerViewResponse?.data, '>>>>>>>>>ress');
  console.log(AuthReducer?.profileResponse, '>>>>>>>>Repsiosns');
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const [data, setdata] = useState([
    {
      img: Icons.co1,
    },
    {
      img: Icons.co2,
    },
    {
      img: Icons.co4,
    },
    {
      img: Icons.co3,
    },
    {
      img: Icons.co5,
    },
  ]);

  const [brandmodal, setbrandmodal] = useState(false);
  const [showstickerdata, setshowstickerdata] = useState(false);
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [selectedStickers1, setSelectedStickers1] = useState([]);
  const [stickermodal, setstickermodal] = useState(false);
  const [select1, setselect1] = useState(0);
  const [select, setselect] = useState(0);
  const [mySticker, setMySticker] = useState([]);

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

  let status = '';
  useEffect(() => {
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/brandItemListRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/brandItemListSuccess':
          status = AuthReducer.status;
          navigation?.navigate('Selectstickers');
          setshowstickerdata(true);

          break;
        case 'Auth/brandItemListFailure':
          status = AuthReducer.status;
          break;

        case 'Auth/myStickerUpdateRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/myStickerUpdateSuccess':
          status = AuthReducer.status;
          // navigation?.navigate('Selectstickers');
          setshowstickerdata(false), setbrandmodal(false);
          dispatch(myStickerViewRequest());
          dispatch(profileRequest());

          break;
        case 'Auth/myStickerUpdateFailure':
          status = AuthReducer.status;
          break;

        case 'Auth/myStickerRemoveRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/myStickerRemoveSuccess':
          status = AuthReducer.status;
          setstickermodal(false);
          setSelectedStickers1([]);
          setselect1(0);
          dispatch(myStickerViewRequest());
          break;
        case 'Auth/myStickerRemoveFailure':
          status = AuthReducer.status;
          break;

        case 'Auth/myStickerViewRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/myStickerViewSuccess':
          status = AuthReducer.status;
          setMySticker(AuthReducer?.myStickerViewResponse?.data?.stickers);
          break;
        case 'Auth/myStickerViewFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);

  // setshowstickerdata(true);
  console.log(selectedStickers1, 'selectedStickers1');
  function SelectFunctionReduce(index) {
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
    // const selectedStickerIds = selectedStickers.map(item => item._id);
    // setStickerInfo({sticker_id: selectedStickerIds});
  }

  function updateBrandWithSticker() {
    const selectedStickerIds = selectedStickers.map(item => item._id);
    let obj = {
      brand_id: AuthReducer?.brandItemListResponse?.data[0]?.brand_id,
      sticker_id: selectedStickerIds,
    };
    // return;
    connectionrequest()
      .then(() => {
        dispatch(myStickerUpdateRequest(obj));
        //props?.navigation?.navigate('Login')
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }

  //

  function Remove_Select_Sticker(index) {
    let arr = AuthReducer?.myStickerViewResponse?.data?.stickers?.map(
      (item, i) => {
        if (i === index) {
          return {...item};
        }
        return item;
      },
    );
    const selectedItem = arr[index];
    const isSelected = selectedStickers1?.some(
      item => item._id === selectedItem?._id,
    );
    if (isSelected) {
      setSelectedStickers1(
        selectedStickers1?.filter(item => item._id !== selectedItem?._id),
      );
      setselect1(select1 - 1);
    } else {
      setSelectedStickers1([...selectedStickers1, selectedItem]);
      setselect1(prevSelect => (isSelected ? prevSelect - 1 : prevSelect + 1));
    }
  }

  function RemoveMySticker() {
    // const removeSticker = selectedStickers1?.map(item => item._id);
    const unselectfilter =
      AuthReducer?.myStickerViewResponse?.data?.stickers.filter(
        item => !selectedStickers1?.some(i => i?._id === item?._id),
      );
    const removeSticker = unselectfilter?.map(item => item._id);
    if (selectedStickers1.length === 0) {
      showErrorAlert('Atlease one sticker should be selected');
      return;
    } else {
      let obj = {
        sticker_id: removeSticker,
      };
      connectionrequest()
        .then(() => {
          {
            removeSticker?.length > 0
              ? dispatch(myStickerRemoveRequest(obj))
              : setstickermodal(false);
          }

          //props?.navigation?.navigate('Login')
        })
        .catch(err => {
          Toast('Please connect To Internet');
        });
    }
  }

  function renderdata({item, index}) {
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={{
          width: normalize(135),
          height: normalize(100),
          backgroundColor: Colors.white,
          marginTop: normalize(15),
          borderRadius: normalize(10),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{
            uri: constants?.IMAGE_URL + 'sticker/' + item?.sticker_thumbnail,
          }}
          style={{
            width: normalize(80),
            height: normalize(60),
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    );
  }

  function renderbrand({item, index}) {
    return (
      <TouchableOpacity
        style={{
          width: normalize(115),
          height: normalize(80),
          backgroundColor: Colors.white,
          marginTop: normalize(15),
          borderRadius: normalize(10),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          dispatch(
            brandItemListRequest({
              page: 1,
              perpage: 100,
              brand_id: item?._id,
            }),
          );
          if (
            item?._id ==
            AuthReducer?.myStickerViewResponse?.data?.stickers?.[0]?.brand_id
          ) {
            setselect(
             AuthReducer?.myStickerViewResponse?.data?.stickers?.length,
            );
            setSelectedStickers(
              AuthReducer?.myStickerViewResponse?.data?.stickers,
            );
          } else {
            setselect(0);
            setSelectedStickers([]);
          }
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

  function RenderSticker({item, index}) {
    const isSelected = selectedStickers?.some(
      selectedItem => selectedItem._id === item._id,
    );
    return (
      <View
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
            onPress={() => SelectFunctionReduce(index)}
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
            height: normalize(40),
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  }

  function renderdata2({item, index}) {
    const isSelected = selectedStickers1?.some(
      selectedItem => selectedItem._id === item._id,
    );
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          Remove_Select_Sticker(index);
        }}
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
            onPress={() => Remove_Select_Sticker(index)}
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
            height: normalize(40),
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    );
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
            My Sticker
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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.RobotoSlabExtraBold,
                fontSize: normalize(11),
                alignSelf: 'center',
              }}>
              Brand
            </Text>
            <TouchableOpacity
              onPress={() => {
                setbrandmodal(true);
              }}
              style={{
                width: normalize(60),
                height: normalize(25),
                backgroundColor: 'rgba(20,174,255,0.2)',
                borderRadius: normalize(15),
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={Icons.pen}
                style={{
                  width: normalize(11),
                  height: normalize(11),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: '#14ABFF',
                  fontFamily: Fonts.RobotoSlabMedium,
                  fontSize: normalize(11),
                  marginLeft: normalize(5),
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: normalize(10),
            }}>
            <TouchableOpacity
              onPress={() => props?.navigation?.navigate('Selectstickers')}
              style={{
                width: normalize(125),
                height: normalize(80),
                backgroundColor: Colors.white,
                borderRadius: normalize(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={
                  AuthReducer?.profileResponse?.data?.brand_details
                    ?.brand_logo !== '' &&
                  AuthReducer?.profileResponse?.data?.brand_details
                    ?.brand_logo !== undefined &&
                  AuthReducer?.profileResponse?.data?.brand_details
                    ?.brand_logo !== null &&
                  AuthReducer?.profileResponse?.data?.brand_details
                    ?.brand_logo !== false
                    ? {
                        uri:
                          constants?.IMAGE_URL +
                          'brand/' +
                          AuthReducer?.profileResponse?.data?.brand_details
                            ?.brand_logo,
                      }
                    : Icons.noImage
                }
                style={{
                  width: normalize(70),
                  height: normalize(40),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
              marginTop: normalize(20),
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.RobotoSlabExtraBold,
                fontSize: normalize(11),
                alignSelf: 'center',
              }}>
              Stickers
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedStickers1(
                  AuthReducer?.myStickerViewResponse?.data?.stickers,
                );
                setselect1(
                  AuthReducer?.myStickerViewResponse?.data?.stickers?.length,
                );
                setstickermodal(true);
              }}
              style={{
                width: normalize(60),
                height: normalize(25),
                backgroundColor: 'rgba(20,174,255,0.2)',
                borderRadius: normalize(15),
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={Icons.pen}
                style={{
                  width: normalize(11),
                  height: normalize(11),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: '#14ABFF',
                  fontFamily: Fonts.RobotoSlabMedium,
                  fontSize: normalize(11),
                  marginLeft: normalize(5),
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          {mySticker?.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingBottom: normalize(30),
                //    marginTop:normalize(10)
              }}
              data={mySticker}
              style={{width: '90%', alignSelf: 'center'}}
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
              }}>
              <Text
                style={{
                  fontSize: normalize(12),
                  marginTop: normalize(30),
                  color: Colors?.lightwhite,
                }}>
                No Stickers Found
              </Text>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={brandmodal}
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
          {showstickerdata ? (
            <View style={{width: '90%', alignSelf: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  setshowstickerdata(false), setbrandmodal(false);
                }}
                style={{alignSelf: 'flex-end', marginBottom: normalize(5)}}>
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
                  paddingTop: normalize(10),
                  paddingHorizontal: normalize(10),
                  paddingBottom: normalize(20),
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.RobotoSlabExtraBold,
                    color: Colors.white,
                    fontSize: normalize(14),

                    width: '80%',
                    alignSelf: 'center',
                  }}>
                  SELECT STICKERS
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.RobotoSlabExtraBold,
                    color: Colors.white,
                    fontSize: normalize(14),
                    width: '80%',
                    alignSelf: 'center',
                  }}>{`${select}/${AuthReducer?.brandItemListResponse?.data?.length} `}</Text>
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
                    renderItem={RenderSticker}
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
                        fontSize: normalize(10),
                        fontFamily: Fonts.RobotoMedium,
                        color: Colors.lightwhite,
                      }}>
                      No Sticker Found
                    </Text>
                  </View>
                )}

                {AuthReducer?.brandItemListResponse?.data?.length > 0 && (
                  <ButtonCom
                    onPress={updateBrandWithSticker}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(15)}
                    title={
                      AuthReducer?.sttus === 'Auth/myStickerUpdateRequest'
                        ? 'Updating....'
                        : 'SAVE'
                    }
                    width={'100%'}
                  />
                )}
                <ButtonCom
                  onPress={() => setshowstickerdata(false)}
                  fontSize={normalize(11)}
                  borderWidth={normalize(1)}
                  borderColor={Colors.blue}
                  letterSpacing={normalize(1.5)}
                  marginTop={normalize(10)}
                  textColor={Colors.blue}
                  title={'BACK'}
                  width={'100%'}
                />
              </View>
            </View>
          ) : (
            <View style={{width: '90%', alignSelf: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  setshowstickerdata(false), setbrandmodal(false);
                }}
                style={{alignSelf: 'flex-end', marginBottom: normalize(5)}}>
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
                  paddingTop: normalize(10),
                  paddingHorizontal: normalize(10),
                  paddingBottom: normalize(20),
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.RobotoSlabExtraBold,
                    color: Colors.white,
                    fontSize: normalize(14),

                    width: '80%',
                    alignSelf: 'center',
                  }}>
                  SELECT BRAND
                </Text>

                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{
                    paddingBottom: normalize(10),
                    //    marginTop:normalize(10)
                  }}
                  data={
                    AuthReducer?.brandListResponse?.data?.length > 0 &&
                    AuthReducer?.brandListResponse?.data
                  }
                  style={{width: '90%', alignSelf: 'center'}}
                  key={2}
                  numColumns={2}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderbrand}
                  horizontal={false}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                />

                {/* <ButtonCom
                  onPress={() => {
                    setshowstickerdata(true);
                  }}
                  backgroundColor={Colors.blue}
                  fontSize={normalize(11)}
                  letterSpacing={normalize(1.5)}
                  marginTop={normalize(15)}
                  title={'NEXT'}
                  width={'100%'}
                /> */}
              </View>
            </View>
          )}
        </View>
      </Modal>

      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={stickermodal}
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
                setstickermodal(false);
              }}
              style={{alignSelf: 'flex-end', marginBottom: normalize(5)}}>
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
                paddingTop: normalize(10),
                paddingHorizontal: normalize(10),
                paddingBottom: normalize(20),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: Fonts.RobotoSlabExtraBold,
                  color: Colors.white,
                  fontSize: normalize(14),

                  width: '80%',
                  alignSelf: 'center',
                }}>
                SELECT STICKERS
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: Fonts.RobotoSlabExtraBold,
                  color: Colors.white,
                  fontSize: normalize(14),

                  width: '80%',
                  alignSelf: 'center',
                }}>{`${select1}/5`}</Text>
              {AuthReducer?.myStickerViewResponse?.data?.stickers?.length >
              0 ? (
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{
                    paddingBottom: normalize(10),
                    //    marginTop:normalize(10)
                  }}
                  data={
                    AuthReducer?.myStickerViewResponse?.data?.stickers?.length >
                      0 && AuthReducer?.myStickerViewResponse?.data?.stickers
                  }
                  style={{width: '100%'}}
                  key={2}
                  numColumns={2}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderdata2}
                  horizontal={false}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                />
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(12),
                      marginTop: normalize(20),
                      color: Colors.lightwhite,
                    }}>
                    No Stickers Found
                  </Text>
                </View>
              )}
              {/*  */}
              <ButtonCom
                onPress={
                  AuthReducer?.myStickerViewResponse?.data?.stickers?.length > 0
                    ? RemoveMySticker
                    : () => setstickermodal(false)
                }
                backgroundColor={Colors.blue}
                fontSize={normalize(11)}
                letterSpacing={normalize(1.5)}
                marginTop={normalize(15)}
                title={
                  AuthReducer?.status === 'Auth/myStickerRemoveRequest'
                    ? 'Removing...'
                    : AuthReducer?.myStickerViewResponse?.data?.stickers
                        ?.length > 0
                    ? 'SAVE'
                    : 'Close'
                }
                width={'100%'}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
}
