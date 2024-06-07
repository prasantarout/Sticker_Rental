import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Platform,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MyStatusBar from '../../utils/MyStatusBar';
import {ImageBackground} from 'react-native';
import {Colors, Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import Model from 'react-native-modal';
import ButtonCom from '../../components/ButtonCom';
import TextInputItem from '../../components/TextInput';
import connectionrequest from '../../utils/helpers/NetInfo';
import {useDispatch, useSelector} from 'react-redux';
import Toast from '../../utils/helpers/Toast';
import {
  addBankAccountRequest,
  bankListRequest,
  brandListRequest,
  changepasswordRequest,
  contactUsRequest,
  deleteAccountRequest,
  deleteBankAccountRequest,
  logoutRequest,
  profileRequest,
  profileupdateRequest,
  viewCarImageRequest,
} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
import constants from '../../utils/helpers/constants';
let status = '';
import ImagePicker from 'react-native-image-crop-picker';
import showErrorAlert from '../../utils/helpers/Toast';
import WebView from 'react-native-webview';

export default function Profile(props) {
  const [logoutmodal, setlogoutmodal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [changepasswordmodal, setchangepasswordmodal] = useState(false);
  const [vehicleInformationModal, setVehicleInformationModal] = useState(false);
  const [CarInformationModal, setCarInformationModal] = useState(false);
  const [oldpassshow, setoldpassshow] = useState(true);
  const [newpassshow, setnewpassshow] = useState(true);
  const [confirmpassshow, setconfirmpassshow] = useState(true);
  const [oldpassword, setoldpassword] = useState('');
  const [newpassword, setnewpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [profilemodal, setprofilemodal] = useState(false);
  const [firstname, setfirstname] = useState('');
  const [lastname, setlasename] = useState('');
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [galleryimg, setgalleryimg] = useState('');
  const [cameraimg, setcameraimg] = useState('');
  const [loading, setloading] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [accountModal, setAccountModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteBankModal, setDeleteBankModal] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [des, setDes] = useState('');

  const blankspace = /\s/;
  const checkforfirstblankspase = /^[a-zA-Z][a-zA-Z\s]*$/;

  useEffect(() => {
    setfirstname(AuthReducer?.profileResponse?.data?.first_name);
    setlasename(AuthReducer?.profileResponse?.data?.last_name);
    connectionrequest()
      .then(() => {
        dispatch(viewCarImageRequest());
        dispatch(bankListRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect to internet');
        console.log(err);
      });
  }, []);

  function resetpasswordfunction() {
    if (oldpassword == '') {
      Toast('Please enter old password');
    } else if (blankspace.test(oldpassword)) {
      Toast('Please enter correct old password');
    } else if (oldpassword?.length < 6) {
      Toast('Please enter atleast 6 digit password');
    } else if (newpassword == '') {
      Toast('Please enter new password');
    } else if (blankspace.test(newpassword)) {
      Toast('Please enter correct new password');
    } else if (newpassword?.length < 6) {
      Toast('Please enter atleast 6 digit password');
    } else if (confirmpassword == '') {
      Toast('Please enter confirm password');
    } else if (newpassword != confirmpassword) {
      Toast('New password and confirm password not match');
    } else {
      let obj = {
        old_password: oldpassword,
        password: newpassword,
      };
      connectionrequest()
        .then(() => {
          dispatch(changepasswordRequest(obj));
          //props?.navigation?.navigate('Login')
        })
        .catch(err => {
          Toast('Please connect To Internet');
        });
    }
  }
  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/changepasswordRequest':
        status = AuthReducer.status;
        break;

      case 'Auth/changepasswordSuccess':
        status = AuthReducer.status;
        setoldpassword(''),
          setnewpassword(''),
          setconfirmpassword(''),
          setchangepasswordmodal(false);
        break;
      case 'Auth/changepasswordFailure':
        status = AuthReducer.status;
        // console.log(AuthReducer?.response)
        setoldpassword(''),
          setnewpassword(''),
          setconfirmpassword(''),
          setchangepasswordmodal(false);
        break;

      case 'Auth/profileupdateRequest':
        status = AuthReducer.status;
        setloading(true);
        break;

      case 'Auth/profileupdateSuccess':
        status = AuthReducer.status;
        dispatch(profileRequest());
        break;
      case 'Auth/profileupdateFailure':
        status = AuthReducer.status;
        setloading(false);
        break;

      case 'Auth/profileRequest':
        status = AuthReducer.status;
        break;

      case 'Auth/profileSuccess':
        status = AuthReducer.status;
        setloading(false);
        setprofilemodal(false);
        setcameraimg('');
        setgalleryimg('');

        break;
      case 'Auth/profileFailure':
        status = AuthReducer.status;
        setloading(false);
        break;

      case 'Auth/contactUsRequest':
        status = AuthReducer.status;
        break;

      case 'Auth/contactUsSuccess':
        status = AuthReducer.status;
        setContactVisible(false);
        setTitle('');
        setDes('');
        break;
      case 'Auth/contactUsFailure':
        status = AuthReducer.status;
        break;
    }
  }

  function btnClick_galeryUpload() {
    // if (props.btnClick_galeryUpload) {
    ImagePicker.openPicker({
      width: normalize(300),
      height: normalize(400),
      cropping: true,
      // multiple: props.multiple,
    })
      .then(response => {
        console.log(response);

        let imageObj = {};

        console.log(response);

        imageObj.name = response.filename
          ? response.filename
          : response.path.replace(/^.*[\\\/]/, '');
        imageObj.type = response.mime;
        imageObj.uri = response.path;
        setgalleryimg(imageObj);
        // console.log(imageObj);
        // props.btnClick_galeryUpload(imageObj);
      })
      .catch(err => console.log(err));
    // }
  }

  function btnClick_cameraUpload() {
    ImagePicker.openCamera({
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
        setcameraimg(imageObj);
        console.log(imageObj);
      })
      .catch(err => console.log(err));
  }

  function profileupdatefunction() {
    if (firstname == '') {
      Toast('Please enter first name');
    } else if (!checkforfirstblankspase.test(firstname)) {
      Toast('Please enter correct first name');
    } else if (lastname == '') {
      Toast('Please enter last name');
    } else if (!checkforfirstblankspase.test(lastname)) {
      Toast('Please enter correct last name');
    } else {
      // let obj = {
      //     first_name: firstname,
      //     last_name: lastname,
      //    (galleryimg =='' && cameraimg  =='') profile_image:''
      // }
      let data = new FormData();
      data.append('first_name', firstname);
      data.append('last_name', lastname);
      {
        (galleryimg != '' || cameraimg != '') &&
          (galleryimg == ''
            ? data.append('profile_image', cameraimg)
            : data.append('profile_image', galleryimg));
      }
      console.log(data);
      connectionrequest()
        .then(() => {
          dispatch(profileupdateRequest(data));
        })
        .catch(err => {
          Toast('Please connect To Internet');
        });
    }
  }

  const Add_bank_account = () => {
    connectionrequest()
      .then(() => {
        dispatch(addBankAccountRequest());
      })
      .catch(err => {
        console.log(err);
        showErrorAlert('Please connect to internet');
      });
  };

  function handleResponse(data) {
    console.log(data);
    let url = data.url.split('?');
    console.log('59===>>>', url);
    let url1 = url[0].split('/');
    console.log('61---->>>', url1);
    if (url1[3] === 'bank-details-add-success') {
      // setBankModalVisible(false)
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setAccountModal(false);
        showErrorAlert('Bank Account is Added successfully');
        dispatch(bankListRequest());
      }, 2000);
    } else if (url1[3] === 'bank-details-add-error') {
      setTimeout(() => {
        setAccountModal(false);
        showErrorAlert('Bank Account not Added');
      }, 2000);
    } else {
      return;
    }
  }

  const bank_delete = bankid => {
    connectionrequest()
      .then(() => {
        let obj = {};
        obj.id = bankid;
        dispatch(deleteBankAccountRequest(obj));
      })
      .catch(err => {
        console.log(err);
        showErrorAlert('Please connect to internet');
      });
  };

  useEffect(() => {
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/deleteAccountRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/deleteAccountSuccess':
          status = AuthReducer.status;
          props?.navigation?.navigate('GetStarted');
          break;
        case 'Auth/deleteAccountFailure':
          status = AuthReducer.status;
          break;

        case 'Auth/deleteBankAccountRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/deleteBankAccountSuccess':
          status = AuthReducer.status;
          dispatch(bankListRequest());
          setDeleteBankModal(false);
          break;
        case 'Auth/deleteBankAccountFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);

  const onlyspace=/^\s+$/

  function contactUsFunction() {
    if (title === '') {
      Toast('Please enter title');
    } else if (onlyspace.test(title)) {
      Toast('Title should not be blank');
    } else if (des == '') {
      Toast('Please enter description');
    } else if (onlyspace.test(des)) {
      Toast('Description should not be blank');
    } else {
      let obj = {
        title: title,
        description: des,
      };
      connectionrequest()
        .then(() => {
          dispatch(contactUsRequest(obj));
          //props?.navigation?.navigate('Login')
        })
        .catch(err => {
          Toast('Please connect To Internet');
        });
    }
  }

  return (
    <>
      <Loader
        visible={
          AuthReducer?.status == 'Auth/logoutRequest' ||
          AuthReducer?.status == 'Auth/bankListRequest' ||
          AuthReducer?.status == 'Auth/deleteAccountRequest'
        }
      />
      <Fragment>
        <MyStatusBar />
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
              Profile
            </Text>
          </View>
          <ScrollView
            style={{
              backgroundColor: Colors.statusbar,
              marginTop: normalize(30),
            }}
            contentContainerStyle={{
              paddingTop: normalize(15),
              paddingBottom: normalize(30),
            }}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                paddingVertical: normalize(25),
                alignSelf: 'center',
                borderRadius: normalize(15),
              }}>
              <Image
                style={{
                  width: normalize(160),
                  height: normalize(160),
                  borderRadius: normalize(20),
                }}
                source={
                  AuthReducer?.profileResponse?.data?.profile_image == null ||
                  AuthReducer?.profileResponse?.data?.profile_image == '' ||
                  AuthReducer?.profileResponse?.data?.profile_image == false
                    ? Icons.usericon
                    : {
                        uri:
                          constants.IMAGEURL +
                          AuthReducer?.profileResponse?.data?.profile_image,
                      }
                }
              />
              <Text
                style={{
                  fontFamily: Fonts.RobotoSlabBold,
                  fontSize: normalize(15),
                  color: Colors.white,
                  textAlign: 'center',
                  marginTop: normalize(20),
                }}>
                {AuthReducer?.profileResponse?.data?.full_name}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.RobotoSlabBold,
                  fontSize: normalize(11),
                  color: Colors.lightwhite,
                  textAlign: 'center',
                  marginTop: normalize(2),
                }}>
                {AuthReducer?.profileResponse?.data?.email}
              </Text>
              {AuthReducer?.profileResponse?.data?.sticker_sent == false?(
                <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop:normalize(2)
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoSlabBold,
                    fontSize: normalize(11),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                  }}>
                  Your Waiting List No.-
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(11),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  {AuthReducer?.profileResponse?.data?.rank}
                </Text>
              </View>
              ):null}
              
              
              <TouchableOpacity
                onPress={() => setprofilemodal(true)}
                style={{
                  width: normalize(100),
                  height: normalize(25),
                  backgroundColor: 'rgba(20,174,255,0.2)',
                  marginTop: normalize(15),
                  borderRadius: normalize(15),
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={Icons.pen}
                  style={{
                    width: normalize(12),
                    height: normalize(12),
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    color: Colors.blue,
                    fontFamily: Fonts.RobotoSlabMedium,
                    fontSize: normalize(12),
                    marginLeft: normalize(5),
                  }}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.RobotoSlabMedium,
                fontSize: normalize(12),
                width: '90%',
                alignSelf: 'center',
                marginVertical: normalize(20),
              }}>
              Vehicle Details
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                paddingVertical: normalize(20),
                alignSelf: 'center',
                borderRadius: normalize(15),
                paddingHorizontal: normalize(15),
              }}>
              {/* <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                  }}>
                  Car Name{' '}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  {
                    AuthReducer?.profileResponse?.data?.vehicle_details
                      ?.car_name
                  }
                </Text>
              </View>
              <Image
                source={Icons.line}
                style={{
                  width: '100%',
                  height: normalize(1),
                  marginVertical: normalize(15),
                }}
              />
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                  }}>
                  Model Number{' '}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  {
                    AuthReducer?.profileResponse?.data?.vehicle_model_details
                      ?.model_name
                  }
                </Text>
              </View>
              <Image
                source={Icons.line}
                style={{
                  width: '100%',
                  height: normalize(1),
                  marginVertical: normalize(15),
                }}
              /> */}
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                  }}>
                  VIN Number{' '}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  {AuthReducer?.profileResponse?.data?.vin_number}
                </Text>
              </View>
              <Image
                source={Icons.line}
                style={{
                  width: '100%',
                  height: normalize(1),
                  marginVertical: normalize(15),
                }}
              />
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                  }}>
                  License Number{' '}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  {AuthReducer?.profileResponse?.data?.license_number}
                </Text>
              </View>
              <Image
                source={Icons.line}
                style={{
                  width: '100%',
                  height: normalize(1),
                  marginVertical: normalize(15),
                }}
              />
              {/* <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                  }}>
                  Number of Doors
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  {AuthReducer?.profileResponse?.data?.number_of_doors}
                </Text>
              </View> */}
              {/* <Image
                source={Icons.line}
                style={{
                  width: '100%',
                  height: normalize(1),
                  marginVertical: normalize(15),
                }}
              /> */}
              <TouchableOpacity
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() =>
                  setVehicleInformationModal(!vehicleInformationModal)
                }>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.lightwhite,
                    textAlign: 'center',
                  }}>
                  Vehicle Informations
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                paddingVertical: normalize(20),
                alignSelf: 'center',
                borderRadius: normalize(15),
                paddingHorizontal: normalize(15),
                marginTop: normalize(20),
              }}>
              <TouchableOpacity
                onPress={() => setchangepasswordmodal(true)}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Change Password
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props?.navigation?.navigate('Earning')}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Earning
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props?.navigation?.navigate('Mysticker')}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  My Sticker
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => props?.navigation?.navigate('UploadSticker')}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Upload Sticker
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                onPress={() => setCarInformationModal(!CarInformationModal)}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Car Information
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  Add_bank_account();
                  setBankModalVisible(true);
                }}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Bank Details
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setContactVisible(true);
                }}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Contact Us
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props?.navigation?.navigate('PrivacyPolicy')}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Privacy Policy
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props?.navigation?.navigate('Terms')}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Terms And Conditions
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Faq')}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  FAQ
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}
                onPress={() => setDeleteModal(!deleteModal)}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Delete Account
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setlogoutmodal(true)}
                style={{
                  borderColor: Colors.lightwhite,
                  borderWidth: 0.4,
                  width: '100%',
                  height: normalize(40),
                  borderRadius: normalize(6),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: normalize(10),
                  marginTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoRegular,
                    fontSize: normalize(13),
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Logout
                </Text>
                <Image
                  source={Icons.rightarrow}
                  style={{
                    width: normalize(10),
                    height: normalize(10),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Model
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={CarInformationModal}
            style={{width: '100%', alignSelf: 'center', margin: 0}}
            animationInTiming={800}
            animationOutTiming={1000}
            avoidKeyboard={true}
            backdropColor={'#1e2633'}
            backdropOpacity={0.7}>
            <View
              style={{
                flex: 1,
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
                    setCarInformationModal(false);
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
                    paddingTop: normalize(30),
                    paddingHorizontal: normalize(10),
                    paddingBottom: normalize(20),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.RobotoSlabExtraBold,
                      color: Colors.white,
                      fontSize: normalize(18),
                    }}>
                    Your Car Image
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
                      }}>
                      <Image
                        source={
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_back_image !== '' &&
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_back_image !== null &&
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_back_image !== undefined
                            ? {
                                uri:
                                  constants?.IMAGEURL +
                                  'captur_car_image/' +
                                  AuthReducer?.viewCarImageResponse?.data
                                    ?.captur_car_back_image,
                              }
                            : Icons.noImage
                        }
                        style={{
                          width: normalize(120),
                          height: normalize(75),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                      />

                      {/* <Text
                        style={{
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(13),
                          color: Colors.white,
                          textAlign: 'center',
                          marginTop: normalize(10),
                          width: '80%',
                          lineHeight: normalize(18),
                        }}>
                        Upload Your Driving License
                      </Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: normalize(125),
                        height: normalize(125),
                        borderRadius: normalize(12),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_front_image !== '' &&
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_front_image !== null &&
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_front_image !== undefined
                            ? {
                                uri:
                                  constants?.IMAGEURL +
                                  'captur_car_image/' +
                                  AuthReducer?.viewCarImageResponse?.data
                                    ?.captur_car_front_image,
                              }
                            : Icons.noImage
                        }
                        style={{
                          width: normalize(120),
                          height: normalize(70),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                      />
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
                      }}>
                      <Image
                        source={
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_left_image !== '' &&
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_left_image !== null &&
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_left_image !== undefined
                            ? {
                                uri:
                                  constants?.IMAGEURL +
                                  'captur_car_image/' +
                                  AuthReducer?.viewCarImageResponse?.data
                                    ?.captur_car_left_image,
                              }
                            : Icons.noImage
                        }
                        style={{
                          width: normalize(120),
                          height: normalize(75),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: normalize(125),
                        height: normalize(125),
                        borderRadius: normalize(12),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_right_image !== '' &&
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_right_image !== null &&
                          AuthReducer?.viewCarImageResponse?.data
                            ?.captur_car_right_image !== undefined
                            ? {
                                uri:
                                  constants?.IMAGEURL +
                                  'captur_car_image/' +
                                  AuthReducer?.viewCarImageResponse?.data
                                    ?.captur_car_right_image,
                              }
                            : Icons.noImage
                        }
                        style={{
                          width: normalize(120),
                          height: normalize(75),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Model>
          <Model
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={vehicleInformationModal}
            style={{width: '100%', alignSelf: 'center', margin: 0}}
            animationInTiming={800}
            animationOutTiming={1000}
            avoidKeyboard={true}
            backdropColor={'#1e2633'}
            backdropOpacity={0.7}>
            <View
              style={{
                flex: 1,
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
                    setVehicleInformationModal(false);
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
                    paddingTop: normalize(30),
                    paddingHorizontal: normalize(10),
                    paddingBottom: normalize(20),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.RobotoSlabExtraBold,
                      color: Colors.white,
                      fontSize: normalize(18),
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
                      }}>
                      <Image
                        source={
                          AuthReducer?.profileResponse?.data
                            ?.driving_license_document !== '' &&
                          AuthReducer?.profileResponse?.data
                            ?.driving_license_document !== null &&
                          AuthReducer?.profileResponse?.data
                            ?.driving_license_document !== undefined
                            ? {
                                uri:
                                  constants?.IMAGEURL +
                                  'document/' +
                                  AuthReducer?.profileResponse?.data
                                    ?.driving_license_document,
                              }
                            : Icons.noImage
                        }
                        style={{
                          width: normalize(120),
                          height: normalize(75),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                      />

                      {/* <Text
                        style={{
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(13),
                          color: Colors.white,
                          textAlign: 'center',
                          marginTop: normalize(10),
                          width: '80%',
                          lineHeight: normalize(18),
                        }}>
                        Upload Your Driving License
                      </Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: normalize(125),
                        height: normalize(125),
                        borderRadius: normalize(12),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          AuthReducer?.profileResponse?.data
                            ?.government_id_document !== '' &&
                          AuthReducer?.profileResponse?.data
                            ?.government_id_document !== null &&
                          AuthReducer?.profileResponse?.data
                            ?.government_id_document !== undefined
                            ? {
                                uri:
                                  constants?.IMAGEURL +
                                  'document/' +
                                  AuthReducer?.profileResponse?.data
                                    ?.government_id_document,
                              }
                            : Icons.noImage
                        }
                        style={{
                          width: normalize(120),
                          height: normalize(70),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                      />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: normalize(125),
                        height: normalize(125),
                        borderRadius: normalize(12),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          AuthReducer?.profileResponse?.data?.car_image !==
                            '' &&
                          AuthReducer?.profileResponse?.data?.car_image !==
                            null &&
                          AuthReducer?.profileResponse?.data?.car_image !==
                            undefined
                            ? {
                                uri:
                                  constants?.IMAGEURL +
                                  'document/' +
                                  AuthReducer?.profileResponse?.data?.car_image,
                              }
                            : Icons.noImage
                        }
                        style={{
                          width: normalize(120),
                          height: normalize(75),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                      />
                    </TouchableOpacity> */}
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
                      }}>
                      <Image
                        source={
                          AuthReducer?.profileResponse?.data
                            ?.vin_number_car_document !== '' &&
                          AuthReducer?.profileResponse?.data
                            ?.vin_number_car_document !== null &&
                          AuthReducer?.profileResponse?.data
                            ?.vin_number_car_document !== undefined
                            ? {
                                uri:
                                  constants?.IMAGEURL +
                                  'document/' +
                                  AuthReducer?.profileResponse?.data
                                    ?.vin_number_car_document,
                              }
                            : Icons.noImage
                        }
                        style={{
                          width: normalize(120),
                          height: normalize(75),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: normalize(125),
                        height: normalize(125),
                        borderRadius: normalize(12),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          AuthReducer?.profileResponse?.data?.car_image !==
                            '' &&
                          AuthReducer?.profileResponse?.data?.car_image !==
                            null &&
                          AuthReducer?.profileResponse?.data?.car_image !==
                            undefined
                            ? {
                                uri:
                                  constants?.IMAGEURL +
                                  'document/' +
                                  AuthReducer?.profileResponse?.data?.car_image,
                              }
                            : Icons.noImage
                        }
                        style={{
                          width: normalize(120),
                          height: normalize(75),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Model>
          <Model
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={logoutmodal}
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
                    setlogoutmodal(false);
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
                    ARE YOU SURE YOU WANT TO LOGOUT?
                  </Text>

                  <ButtonCom
                    onPress={() => {
                      //setlogoutmodal(false), props?.navigation?.navigate('Signin')
                      connectionrequest()
                        .then(() => {
                          setlogoutmodal(false);
                          dispatch(logoutRequest());
                          //props?.navigation?.navigate('Login')
                        })
                        .catch(err => {
                          Toast('Please connect To Internet');
                        });
                    }}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(15)}
                    title={'CONTINUE'}
                    width={'100%'}
                  />
                  <ButtonCom
                    onPress={() => {
                      setlogoutmodal(false);
                    }}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(15)}
                    title={'CANCEL'}
                    width={'100%'}
                  />
                </View>
              </View>
            </View>
          </Model>
          <Model
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={changepasswordmodal}
            style={{width: '100%', alignSelf: 'center', margin: 0}}
            animationInTiming={800}
            animationOutTiming={1000}
            avoidKeyboard={true}
            backdropColor={'#1e2633'}
            backdropOpacity={0.7}>
            <Loader
              visible={AuthReducer?.status == 'Auth/changepasswordRequest'}
            />
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
                    setoldpassword(''),
                      setnewpassword(''),
                      setconfirmpassword(''),
                      setchangepasswordmodal(false);
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
                    paddingTop: normalize(30),
                    paddingHorizontal: normalize(10),
                    paddingBottom: normalize(20),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.RobotoSlabExtraBold,
                      color: Colors.white,
                      fontSize: normalize(18),
                    }}>
                    CHANGE THE PASSWORD
                  </Text>
                  <TextInputItem
                    placeholder={'Old Password'}
                    isleftimage={true}
                    leftimage={Icons.password}
                    onChangeText={val => setoldpassword(val)}
                    value={oldpassword}
                    isSecure={oldpassshow}
                    isrightimage={true}
                    rightimagepress={() => setoldpassshow(!oldpassshow)}
                    showhide={oldpassshow}
                  />
                  <TextInputItem
                    placeholder={'New Password'}
                    isleftimage={true}
                    leftimage={Icons.password}
                    onChangeText={val => setnewpassword(val)}
                    value={newpassword}
                    isSecure={newpassshow}
                    isrightimage={true}
                    rightimagepress={() => setnewpassshow(!newpassshow)}
                    showhide={newpassshow}
                  />
                  <TextInputItem
                    placeholder={'Confirm Password'}
                    isleftimage={true}
                    leftimage={Icons.password}
                    onChangeText={val => setconfirmpassword(val)}
                    value={confirmpassword}
                    isSecure={confirmpassshow}
                    isrightimage={true}
                    rightimagepress={() => setconfirmpassshow(!confirmpassshow)}
                    showhide={confirmpassshow}
                  />

                  <ButtonCom
                    onPress={() => {
                      // setoldpassword(''),setnewpassword(''),setconfirmpassword(''), setchangepasswordmodal(false)
                      resetpasswordfunction();
                    }}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(15)}
                    title={'RESET PASSWORD'}
                    width={'100%'}
                  />
                </View>
              </View>
            </View>
          </Model>

          <Model
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={profilemodal}
            style={{width: '100%', alignSelf: 'center', margin: 0}}
            animationInTiming={800}
            animationOutTiming={1000}
            avoidKeyboard={true}
            backdropColor={'#1e2633'}
            backdropOpacity={0.7}>
            <Loader visible={loading} />
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
                    setprofilemodal(false),
                      setfirstname(
                        AuthReducer?.profileResponse?.data?.first_name,
                      ),
                      setlasename(
                        AuthReducer?.profileResponse?.data?.last_name,
                      ),
                      setcameraimg(''),
                      setgalleryimg('');
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
                      fontSize: normalize(16),

                      width: '80%',
                      alignSelf: 'center',
                    }}>
                    UPLOAD PROFILE PICTURE
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: normalize(10),
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        cameraimg == ''
                          ? btnClick_galeryUpload()
                          : Toast('Please remove camera image')
                      }
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: normalize(125),
                        height: normalize(125),
                        borderRadius: normalize(12),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {galleryimg == '' ? (
                        <Image
                          source={Icons.gallery}
                          style={{
                            width: normalize(45),
                            height: normalize(45),
                            resizeMode: 'contain',
                          }}
                        />
                      ) : (
                        <View>
                          <Image
                            source={{uri: galleryimg?.uri}}
                            style={{
                              width: normalize(45),
                              height: normalize(45),
                              resizeMode: 'stretch',
                              borderRadius: normalize(10),
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => setgalleryimg('')}
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
                      <Text
                        style={{
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(10),
                          color: Colors.white,
                          textAlign: 'center',
                          marginTop: normalize(10),
                          width: '80%',
                          lineHeight: normalize(18),
                        }}>
                        Select from gallery
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        galleryimg == ''
                          ? btnClick_cameraUpload()
                          : Toast('Please remove gallery image')
                      }
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: normalize(125),
                        height: normalize(125),
                        borderRadius: normalize(12),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {cameraimg == '' ? (
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
                            source={{uri: cameraimg?.uri}}
                            style={{
                              width: normalize(45),
                              height: normalize(45),
                              resizeMode: 'stretch',
                              borderRadius: normalize(10),
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => setcameraimg('')}
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
                      <Text
                        style={{
                          fontFamily: Fonts.RobotoMedium,
                          fontSize: normalize(10),
                          color: Colors.white,
                          textAlign: 'center',
                          marginTop: normalize(10),
                          width: '80%',
                          lineHeight: normalize(18),
                        }}>
                        Use camera
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TextInputItem
                    placeholder={'First Name'}
                    isleftimage={true}
                    leftimage={Icons.nameicon}
                    onChangeText={val => setfirstname(val)}
                    value={firstname}
                    marginTop={normalize(10)}
                  />
                  <TextInputItem
                    placeholder={'Last Name'}
                    isleftimage={true}
                    leftimage={Icons.nameicon}
                    onChangeText={val => setlasename(val)}
                    value={lastname}
                    marginTop={normalize(10)}
                  />

                  <ButtonCom
                    onPress={() => {
                      //setprofilemodal(false), setfirstname(AuthReducer?.profileResponse?.data?.first_name), setlasename(AuthReducer?.profileResponse?.data?.last_name)
                      profileupdatefunction();
                    }}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(15)}
                    title={'SAVE'}
                    width={'100%'}
                  />
                </View>
              </View>
            </View>
          </Model>
          <Model
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={deleteModal}
            style={{width: '100%', alignSelf: 'center', margin: 0}}
            animationInTiming={800}
            animationOutTiming={1000}
            avoidKeyboard={true}
            backdropColor={'#1e2633'}
            backdropOpacity={0.7}>
            <Loader
              visible={AuthReducer?.status === 'Auth/deleteAccountRequest'}
            />
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
                    setDeleteModal(false);
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
                    paddingTop: normalize(30),
                    paddingHorizontal: normalize(10),
                    paddingBottom: normalize(20),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.RobotoSlabExtraBold,
                      color: Colors.white,
                      fontSize: normalize(15),
                    }}>
                    ARE YOU SURE YOU WANT TO DELETE YOUR ACCOUNT?
                  </Text>

                  <ButtonCom
                    onPress={() => {
                      //setlogoutmodal(false), props?.navigation?.navigate('Signin')
                      connectionrequest()
                        .then(() => {
                          setDeleteModal(false);
                          dispatch(deleteAccountRequest());
                          //props?.navigation?.navigate('Login')
                        })
                        .catch(err => {
                          Toast('Please connect To Internet');
                        });
                    }}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(15)}
                    title={'DELETE'}
                    width={'100%'}
                  />
                  <ButtonCom
                    onPress={() => {
                      setDeleteModal(false);
                    }}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(15)}
                    title={'CANCEL'}
                    width={'100%'}
                  />
                </View>
              </View>
            </View>
          </Model>

          <Model
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={bankModalVisible}
            style={{width: '100%', alignSelf: 'center', margin: 0}}
            animationInTiming={800}
            animationOutTiming={1000}
            avoidKeyboard={true}
            backdropColor={'#1e2633'}
            backdropOpacity={0.7}>
            <Loader
              visible={AuthReducer?.status == 'Auth/changepasswordRequest'}
            />
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
                    setBankModalVisible(false);
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
                    paddingTop: normalize(30),
                    paddingHorizontal: normalize(10),
                    paddingBottom: normalize(20),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.RobotoSlabExtraBold,
                      color: Colors.white,
                      fontSize: normalize(18),
                      textTransform: 'uppercase',
                    }}>
                    Bank details
                  </Text>
                  {AuthReducer?.bankListRes?.data?.length > 0 ? (
                    <View
                      style={{
                        height: normalize(80),
                        width: '100%',
                        backgroundColor: Colors.inputbackgroundcolor,
                        marginTop: normalize(15),
                        borderRadius: normalize(10),
                        flexDirection: 'row',
                        // justifyContent: 'space-between',
                        padding: normalize(7),
                        alignItems: 'center',
                      }}>
                      {/* <Image
                       resizeMode="contain"
                       source={Icons.circlearrowdown}
                       style={{
                         height: normalize(70),
                         width: normalize(20),
                       }}
                     /> */}
                      <View
                        style={{
                          marginLeft: normalize(10),
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.RobotoMedium,
                            fontSize: normalize(12),
                            color: Colors.white,
                          }}>
                          {AuthReducer?.bankListRes?.data[0]?.bank_name}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginVertical: normalize(3),
                          }}>
                          <Text
                            style={{
                              fontFamily: Fonts.RobotoRegular,
                              fontSize: normalize(11),
                              color: '#B0B4BA',
                            }}>
                            Ac no. :
                          </Text>
                          <Text
                            style={{
                              fontFamily: Fonts.RobotoRegular,
                              fontSize: normalize(11),
                              color: Colors.white,
                            }}>
                            {' '}
                            **** **** ****{' '}
                            {
                              AuthReducer?.bankListRes?.data?.[0]
                                ?.account_number
                            }
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              fontFamily: Fonts.RobotoRegular,
                              fontSize: normalize(11),
                              color: '#B0B4BA',
                            }}>
                            Routing No.:
                          </Text>
                          <Text
                            style={{
                              fontFamily: Fonts.RobotoRegular,
                              fontSize: normalize(11),
                              color: Colors.white,
                            }}>
                            {' '}
                            {
                              AuthReducer?.bankListRes?.data?.[0]
                                ?.routing_number
                            }
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setDeleteBankModal(true);
                        }}
                        style={{
                          right: normalize(5),
                          height: normalize(20),
                          width: normalize(20),
                          top: normalize(5),
                          position: 'absolute',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          style={{
                            height: normalize(12),
                            width: normalize(12),
                          }}
                          resizeMode="contain"
                          source={Icons.delete}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontFamily: Fonts.RobotoBold,
                        color: Colors.white,
                        fontSize: normalize(13),
                        marginVertical: normalize(10),
                        alignSelf: 'center',
                      }}>
                      No Account Added Yet
                    </Text>
                  )}

                  {AuthReducer?.bankListRes?.data?.length > 0 ? null : (
                    <ButtonCom
                      onPress={() => {
                        setBankModalVisible(false);
                        setTimeout(() => {
                          setAccountModal(true);
                          setIsLoading(true);
                        }, 2000);
                      }}
                      backgroundColor={Colors.blue}
                      fontSize={normalize(11)}
                      letterSpacing={normalize(1.5)}
                      marginTop={normalize(15)}
                      title={'ADD BANK ACCOUNT'}
                      width={'100%'}
                    />
                  )}
                </View>
              </View>
            </View>
            <Model
              animationIn={'slideInUp'}
              animationOut={'slideOutDown'}
              backdropTransitionOutTiming={0}
              hideModalContentWhileAnimating={true}
              isVisible={deleteBankModal}
              style={{width: '100%', alignSelf: 'center', margin: 0}}
              animationInTiming={800}
              animationOutTiming={1000}
              avoidKeyboard={true}
              backdropColor={'#1e2633'}
              backdropOpacity={0.7}>
              <Loader
                visible={
                  AuthReducer?.status === 'Auth/deleteBankAccountRequest'
                }
              />
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
                      setDeleteBankModal(false);
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
                      paddingTop: normalize(30),
                      paddingHorizontal: normalize(10),
                      paddingBottom: normalize(20),
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: Fonts.RobotoSlabExtraBold,
                        color: Colors.white,
                        fontSize: normalize(15),
                      }}>
                      ARE YOU SURE YOU WANT TO DELETE YOUR BANK ACCOUNT?
                    </Text>

                    <ButtonCom
                      onPress={() => {
                        bank_delete(AuthReducer?.bankListRes?.data?.[0]?._id);
                      }}
                      backgroundColor={Colors.blue}
                      fontSize={normalize(11)}
                      letterSpacing={normalize(1.5)}
                      marginTop={normalize(15)}
                      title={'DELETE'}
                      width={'100%'}
                    />
                    <ButtonCom
                      onPress={() => {
                        setDeleteBankModal(false);
                      }}
                      backgroundColor={Colors.blue}
                      fontSize={normalize(11)}
                      letterSpacing={normalize(1.5)}
                      marginTop={normalize(15)}
                      title={'CANCEL'}
                      width={'100%'}
                    />
                  </View>
                </View>
              </View>
            </Model>
          </Model>
          <Modal
            visible={accountModal}
            onRequestClose={() => setAccountModal(false)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              flex: 1,
            }}>
            <SafeAreaView
              style={{flex: 1, backgroundColor: isLoading ? '#0B1629' : null}}>
              {isLoading && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#0B1629',
                  }}>
                  <ActivityIndicator size="large" color={Colors.white} />
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoBold,
                      color: Colors.white,
                      fontSize: normalize(14),
                      marginTop: normalize(10),
                    }}>
                    Please Wait...
                  </Text>
                </View>
              )}
              <WebView
                source={{uri: AuthReducer?.addBankAccountRes?.data?.url}}
                onNavigationStateChange={data => handleResponse(data)}
                onLoad={syntheticEvent => {
                  const {nativeEvent} = syntheticEvent;
                  console.log('syntheticEvent', syntheticEvent);
                  setIsLoading(false);
                }}
                onMessage={event => {
                  console.log('event', event);
                }}
                style={{flex: 1, display: isLoading ? 'none' : 'flex'}}
              />
            </SafeAreaView>
          </Modal>

          <Model
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={contactVisible}
            style={{width: '100%', alignSelf: 'center', margin: 0}}
            animationInTiming={800}
            animationOutTiming={1000}
            avoidKeyboard={true}
            backdropColor={'#1e2633'}
            backdropOpacity={0.7}>
            <Loader visible={AuthReducer?.status == 'Auth/contactUsRequest'} />
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
                    setTitle(''), setDes(''), setContactVisible(false);
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
                    paddingTop: normalize(30),
                    paddingHorizontal: normalize(10),
                    paddingBottom: normalize(20),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.RobotoSlabExtraBold,
                      color: Colors.white,
                      fontSize: normalize(18),
                    }}>
                    CONTACT US
                  </Text>
                  <TextInputItem
                    placeholder={'Title'}
                    isleftimage={false}
                    onChangeText={val => setTitle(val)}
                    value={title}
                  />
                  <TextInputItem
                    placeholder={'Description'}
                    isleftimage={false}
                    onChangeText={val => setDes(val)}
                    value={des}
                    multiline={true}
                    height={normalize(120)}
                  />

                  <ButtonCom
                    onPress={() => {
                      contactUsFunction();
                    }}
                    backgroundColor={Colors.blue}
                    fontSize={normalize(11)}
                    letterSpacing={normalize(1.5)}
                    marginTop={normalize(15)}
                    title={'SUBMIT'}
                    width={'100%'}
                  />
                </View>
              </View>
            </View>
          </Model>
        </ImageBackground>
      </Fragment>
    </>
  );
}
