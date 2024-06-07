import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MyStatusBar from '../../utils/MyStatusBar';
import {Colors, Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import Modal from 'react-native-modal';
import ButtonCom from '../../components/ButtonCom';
import {useDispatch, useSelector} from 'react-redux';
import connectionrequest from '../../utils/helpers/NetInfo';
import Toast from '../../utils/helpers/Toast';
import {
  profileRequest,
  profileupdateRequest,
  uploadCarImageRequest,
} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
import constants from '../../utils/helpers/constants';
import ImageCropPicker from 'react-native-image-crop-picker';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
let status;

export default function Home(props) {
  const mapRef = useRef();
  const [scanmodal, setscanmodal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 1: Front, 2: Back, 3: Left, 4: Right
  const [uploadedImages, setUploadedImages] = useState([]);

  const [startPoint, setStartPoint] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [endPoint, setEndPoint] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [lineCoords, setLineCoords] = useState([]);

  const [isEnd, setIsEnd] = useState(false);
  const [totalDis, setTotalDis] = useState(0);
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(null);
  const [startTrafficCoord, setStartTrafficCoord] = useState(null);
  const [endTrafficCoord, setEndTrafficCoord] = useState(null);
  const [trafficActive, setTrafficActive] = useState(false);
  const [distanceDuringTraffic, setDistanceDuringTraffic] = useState(null);
  const [cleartraffic, setClearTraffic] = useState('');
  const [calculationActive, setCalculationActive] = useState(false);
  const [angle, setAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0.015);
  const watchIdRef = useRef(null);
  const [waitingListModal, setWaitingListModal] = useState(false);

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(profileRequest());
        //props?.navigation?.navigate('Login')
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
    requestLocationPermission();
  }, []);

  const calculateBearing = (start, end) => {
    const lat1 = start.latitude * (Math.PI / 180);
    const lon1 = start.longitude * (Math.PI / 180);
    const lat2 = end.latitude * (Math.PI / 180);
    const lon2 = end.longitude * (Math.PI / 180);

    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const brng = Math.atan2(y, x) * (180 / Math.PI);
    return (brng + 360) % 360;
  };

  const haversineDistance = (coords1, coords2) => {
    const toRad = x => (x * Math.PI) / 180;
    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;
    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const R = 6371e3; // metres
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  };

  const findNearestPoint = (polyline, point) => {
    let minDistance = Infinity;
    let nearestPoint = polyline[0];

    polyline.forEach(polyPoint => {
      const distance = haversineDistance(polyPoint, point);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = polyPoint;
      }
    });

    return nearestPoint;
  };

  useEffect(() => {
    // let watchId;
    if (calculationActive) {
      console.log('Starting watchPosition');
      watchIdRef.current = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const newCoordinate = {latitude, longitude};
          const heading = position.coords.heading;

          setRouteCoordinates(prevRouteCoordinates => [
            ...prevRouteCoordinates,
            newCoordinate,
          ]);

          // Find the nearest point on the polyline
          const nearestPoint = findNearestPoint(
            routeCoordinates,
            newCoordinate,
          );

          // Calculate angle if heading is not available
          if (heading === null) {
            const lastCoordinate =
              routeCoordinates[routeCoordinates.length - 1];
            if (lastCoordinate) {
              const newAngle = calculateBearing(lastCoordinate, nearestPoint);
              setAngle(newAngle);
            }
          } else {
            setAngle(heading);
          }
          // setAngle(heading)
          // console.log(position,'position');
          setStartPoint({
            latitude: latitude,
            longitude: longitude,
          });

          // Zoom in when the car starts moving
          if (routeCoordinates.length > 1) {
            setZoomLevel(0.005); // Smaller delta values mean higher zoom level
          }

          // setPrevLocation(startPoint)
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }

          fetch(
            `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${position?.coords?.latitude},${position?.coords?.longitude}&destinations=${position?.coords?.latitude},${position?.coords?.longitude}&departure_time=now&key=AIzaSyBYDOgLZMgQTbs4AD3b9TUDQJhJG3fIReI`,
          )
            .then(response => response.json())
            .then(data => {
              // console.log('Res ', data);
              // Process the response to determine if user is in a traffic-congested area
              const durationInTraffic =
                data?.rows?.[0]?.elements?.[0]?.duration_in_traffic?.value;
              const duration = data?.rows?.[0]?.elements?.[0]?.duration?.value;
              const trafficRatio = durationInTraffic / duration; // Ratio of time spent in traffic

              if (trafficRatio > 1.2) {
                if (!trafficActive) {
                  setStartTrafficCoord(newCoordinate);
                  setTrafficActive(true);
                }
                console.log('traffic');
                setClearTraffic('traffic');
              } else {
                if (trafficActive) {
                  setEndTrafficCoord(newCoordinate);
                  setTrafficActive(false);
                }
                console.log('Clear');
                setClearTraffic('Clear');
              }
            })

            .catch(error => {
              console.error('Error fetching traffic data:', error);
            });
        },

        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10,
        },
      );
    }
    return () => {
      if (watchIdRef.current !== null) {
        console.log('Stopping watchPosition');
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [calculationActive, trafficActive]);

  useEffect(() => {
    if (startTrafficCoord && endTrafficCoord) {
      const distance = calculateDistance(
        startTrafficCoord.latitude,
        startTrafficCoord.longitude,
        endTrafficCoord.latitude,
        endTrafficCoord.longitude,
      );
      console.log('Distance during traffic:', distance);
      setDistanceDuringTraffic(distanceDuringTraffic + distance);
    }
  }, [endTrafficCoord]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance / 1000;
  };

  async function btnClick_next(arr) {
    let obj = new FormData();
    obj.append('captur_car_front_image', arr[0]);
    obj.append('captur_car_back_image', arr[1]);
    obj.append('captur_car_left_image', arr[2]);
    obj.append('captur_car_right_image', arr[3]);
    try {
      await connectionrequest();
      await dispatch(uploadCarImageRequest(obj));
      // props?.navigation?.navigate('Login');
    } catch (err) {
      Toast('Please connect To Internet');
    }
  }

  useEffect(() => {
    if (currentStep === 4) {
      setscanmodal(false);
      return;
    } else if (
      AuthReducer?.profileResponse?.data?.is_captur_car_image === false &&
      AuthReducer?.profileResponse?.data?.sticker_sent == true
    ) {
      if (currentStep <= 4) {
        setscanmodal(true);
      }
    }
    if (AuthReducer?.profileResponse?.data?.sticker_sent == false) {
      setWaitingListModal(true);
    }
  }, [currentStep, AuthReducer?.profileResponse?.data]);

  useEffect(() => {
    if (uploadedImages.length === 4) {
      btnClick_next(uploadedImages);
      return;
    }
    dispatch(profileRequest());
  }, [uploadedImages]);

  const setEndLocation = () => {};

  function btnClick_cameraUpload() {
    if (currentStep < 4) {
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        multiple: props?.multiple,
        mediaType: 'photo',
        includeBase64: true,
        compressImageQuality: 0.1,
        maxFiles: 5,
      })
        .then(response => {
          let imageObj = {};
          setCurrentStep(currentStep + 1);
          imageObj.name = response.filename
            ? response.filename
            : response.path.replace(/^.*[\\\/]/, '');
          imageObj.type = response.mime;
          imageObj.uri = response.path;
          imageObj.size = response.size;
          imageObj.filedata = response.data;
          setUploadedImages(prevImages => [...prevImages, imageObj]);

          // props.btnClick_cameraUpload(imageObj);
        })
        .then(() => {
          btnClick_next();
        })
        .catch(err => console.log(err));
    }
  }

  function getImageType(step) {
    switch (step) {
      case 0:
        return 'Front Side';
      case 1:
        return 'Back Side';
      case 2:
        return 'Left Side';
      case 3:
        return 'Right Side';
      default:
        return '';
    }
  }

  function getDescriptionText(step) {
    return `You need to upload your car  ${getImageType(step)} image.`;
  }

  const requestLocationPermission = async () => {
    console.log('is log');
    if (Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        info => {
          console.log('Location Info', info);
          let currentLocation = {
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          };

          setStartPoint({
            latitude: currentLocation?.latitude,
            longitude: currentLocation?.longitude,
          });
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );

      // subscribeLocationLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        console.log(granted, PermissionsAndroid.RESULTS.GRANTED);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          Geolocation.getCurrentPosition(
            info => {
              console.log('Location Info', info);
              let currentLocation = {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
              };
              console.log('currentLocation---->', currentLocation);

              setStartPoint({
                latitude: currentLocation?.latitude,
                longitude: currentLocation?.longitude,
              });
            },
            error => {
              console.log(error);
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
          );

          // subscribeLocationLocation();
        } else {
          console.log('Permission Denied');
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getEndLocation = async () => {
    Geolocation.getCurrentPosition(
      info => {
        console.log('Location Info', info);
        let currentLocation = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        };

        setEndPoint({
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
        });
        setTimeout(() => {
          setIsEnd(true);
        }, 1000);
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 360000},
    );
  };

  const getStartLocation = async () => {
    Geolocation.getCurrentPosition(
      info => {
        console.log('Location Info', info);
        let currentLocation = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        };

        setStartPoint({
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
        });
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 360000},
    );
  };
  console.log(routeCoordinates, 'routeCoordinates');

  useEffect(() => {
    if (routeCoordinates.length > 1) {
      const newDistance = haversine_function(
        routeCoordinates[routeCoordinates.length - 2].latitude,
        routeCoordinates[routeCoordinates.length - 2].longitude,
        routeCoordinates[routeCoordinates.length - 1].latitude,
        routeCoordinates[routeCoordinates.length - 1].longitude,
      );
      setTotalDis(prevDistance => prevDistance + newDistance);
    }
  }, [routeCoordinates]);

  const haversine_function = (lat1, lon1, lat2, lon2) => {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d; // Distance in km
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/uploadCarImageRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/uploadCarImageSuccess':
        status = AuthReducer.status;
       dispatch(profileRequest())
        break;
      case 'Auth/uploadCarImageFailure':
        status = AuthReducer.status;
        break;
    }}

  return (
    <>
      <Loader visible={AuthReducer?.status == 'Auth/profileRequest'} />
      {/* <Fragment> */}
      <MyStatusBar />
      {/* <View style={{flex: 1}}> */}
      <MapView
        showsTraffic
        // showsUserLocation={true}
        // onUserLocationChange={()=>{}}
        followsUserLocation={true}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        ref={mapRef}
        style={{
          flex: 1,
          // marginTop: Platform.OS == 'android' ? normalize(20) : normalize(0),
        }}
        region={{
          latitude: startPoint?.latitude,
          longitude: startPoint?.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        }}>
        <Marker
          // rotation={calculateBearing(prevLocation, startPoint)}
          anchor={{x: 0.5, y: 0.5}}
          coordinate={{
            latitude: startPoint?.latitude,
            longitude: startPoint?.longitude,
          }}
          style={{
            width: normalize(20),
            height: normalize(20),
          }}>
          <Image
            source={Icons.car1}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
              transform: [{rotate: `${angle}deg`}],
            }}
          />
        </Marker>
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={3}
          strokeColor={Colors.blue}
        />
      </MapView>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          top: Platform.OS == 'android' ? normalize(70) : normalize(55),
          justifyContent: 'space-between',
          width: '90%',
          alignSelf: 'center',
          // top: normalize(0),
          position: 'absolute',
        }}>
        <TouchableOpacity
          style={{
            width: normalize(30),
            height: normalize(30),
            backgroundColor: Colors.white,
            shadowColor: '#000',
            borderRadius: normalize(8),
            alignItems: 'center',
            justifyContent: 'center',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 3,
          }}>
          <Image
            source={Icons.search}
            style={{
              width: normalize(12),
              height: normalize(12),
              resizeMode: 'stretch',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: Colors.blue,
            height: normalize(30),
            width: normalize(205),
            borderRadius: normalize(8),
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontFamily: Fonts.RobotoSlabBold,
              fontSize: normalize(14),
              color: Colors.white,
            }}>
            $208.56
          </Text>
          <TouchableOpacity style={{marginLeft: normalize(5)}}>
            <Image
              source={Icons.whiteinformation}
              style={{
                width: normalize(8),
                height: normalize(8),
                tintColor: Colors.white,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => props?.navigation?.navigate('Profile')}
          style={{width: normalize(30), height: normalize(30)}}>
          <Image
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
            style={{
              width: normalize(30),
              height: normalize(30),
              resizeMode: 'stretch',
              borderRadius: normalize(10),
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={[{position: 'absolute', bottom: normalize(75), right: 0}]}>
        <ButtonCom
          disabled={true}
          onPress={() => {}}
          backgroundColor={Colors.blue}
          fontSize={normalize(11)}
          letterSpacing={normalize(1.5)}
          marginTop={normalize(20)}
          title={
            distanceDuringTraffic
              ? distanceDuringTraffic?.toFixed(2) + 'Km'
              : 'Distance Traffic'
          }
          width={'80%'}
        />
      </View>

      {/* <View
              style={{
                backgroundColor: Colors.blue,
                height: normalize(45),
                width: '90%',
                borderRadius: normalize(12),
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                position: 'absolute',
                bottom: normalize(35),
                alignSelf: 'center',
                paddingHorizontal: normalize(15),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.RobotoMedium,
                  fontSize: normalize(11),
                  color: Colors.white,
                  textTransform: 'capitalize',
                }}>
                The brand you are working with
              </Text>
              <View
                style={{
                  width: normalize(70),
                  height: normalize(25),
                  backgroundColor: Colors.white,
                  borderRadius: normalize(5),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={
                    AuthReducer?.profileResponse?.data?.brand_details
                      ?.brand_logo !== null &&
                    AuthReducer?.profileResponse?.data?.brand_details
                      ?.brand_logo !== '' &&
                    AuthReducer?.profileResponse?.data?.brand_details
                      ?.brand_logo !== false &&
                    AuthReducer?.profileResponse?.data?.brand_details
                      ?.brand_logo !== undefined
                      ? {
                          uri:
                            constants?.IMAGE_URL +
                            'brand/' +
                            AuthReducer?.profileResponse?.data?.brand_details
                              ?.brand_logo,
                        }
                      : Icons.pepsi
                  }
                  style={{
                    width: normalize(40),
                    height: normalize(25),
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </View> */}
      <View style={[{position: 'absolute', bottom: 20, right: 0}]}>
        <ButtonCom
          disabled={!calculationActive ? true : false}
          onPress={() => {
            if (AuthReducer?.profileResponse?.data?.sticker_sent == false) {
              setWaitingListModal(true);
              // setCalculationActive(false);
            } else {
              getEndLocation();
              setCalculationActive(false);
              setStartTrafficCoord(null);
              setEndTrafficCoord(null);
            }
          }}
          backgroundColor={Colors.blue}
          fontSize={normalize(11)}
          letterSpacing={normalize(1.5)}
          marginTop={normalize(20)}
          title={
            totalDis == 0 ? 'END' : `${parseFloat(totalDis)?.toFixed(2)} km`
          }
          width={'80%'}
        />
      </View>

      <View style={[{position: 'absolute', bottom: 20, left: 20}]}>
        <ButtonCom
          disabled={calculationActive ? true : false}
          onPress={() => {
            if (AuthReducer?.profileResponse?.data?.sticker_sent == false) {
              setWaitingListModal(true);
              // setCalculationActive(true);
            } else {
              setCalculationActive(true);
              getStartLocation();
              setTotalDis(0);
              setDistanceDuringTraffic(null);
              setRouteCoordinates([]);
            }
          }}
          backgroundColor={Colors.blue}
          fontSize={normalize(11)}
          letterSpacing={normalize(1.5)}
          marginTop={normalize(20)}
          title={'START'}
          width={'80%'}
        />
      </View>
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={scanmodal}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={1000}
        avoidKeyboard={true}
        backdropColor={'#1e2633'}
        backdropOpacity={0.7}>
        <View
          style={{
            // flex: 1,
            backgroundColor: Colors.statusbar,
            width: '90%',
            alignSelf: 'center',
            paddingVertical: normalize(25),
            borderRadius: normalize(8),
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.8,
            shadowRadius: 40,
            elevation: 1,
            shadowColor: Colors.black,
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Image
            source={Icons.screen}
            style={{
              width: normalize(90),
              height: normalize(90),
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              fontFamily: Fonts.RobotoSlabExtraBold,
              color: Colors.white,
              fontSize: normalize(12),
              textAlign: 'center',
              marginTop: normalize(15),
            }}>
            Capture Your Car {getImageType(currentStep)} Picture
          </Text>
          <Text
            style={{
              fontFamily: Fonts.RobotoRegular,
              fontSize: normalize(10),
              color: Colors.lightwhite,
              textAlign: 'center',
              marginTop: normalize(8),
              textTransform: 'capitalize',
            }}>
            {getDescriptionText(currentStep)}
          </Text>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <ButtonCom
              onPress={btnClick_cameraUpload}
              backgroundColor={Colors.blue}
              fontSize={normalize(11)}
              letterSpacing={normalize(1.5)}
              marginTop={normalize(20)}
              title={'Upload'}
              width={'100%'}
            />
            {/* setscanmodal(false) */}
          </View>
        </View>
      </Modal>

      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={waitingListModal}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={1000}
        avoidKeyboard={true}
        backdropColor={'#1e2633'}
        backdropOpacity={0.7}>
        <View
          style={{
            // flex: 1,
            backgroundColor: Colors.statusbar,
            width: '90%',
            alignSelf: 'center',
            paddingVertical: normalize(25),
            borderRadius: normalize(8),
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.8,
            shadowRadius: 40,
            elevation: 1,
            shadowColor: Colors.black,
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Text
            style={{
              fontFamily: Fonts.RobotoSlabExtraBold,
              color: Colors.white,
              fontSize: normalize(12),
              textAlign: 'center',
              marginTop: normalize(15),
            }}>
            Now You Are In Waiting List
          </Text>
          <Text
            style={{
              fontFamily: Fonts.RobotoRegular,
              fontSize: normalize(10.5),
              color: Colors.lightwhite,
              textAlign: 'center',
              marginTop: normalize(8),
            }}>
            Your waiting list number is {AuthReducer?.profileResponse?.data?.rank}
          </Text>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <ButtonCom
              onPress={() => {
                setWaitingListModal(false);
              }}
              backgroundColor={Colors.blue}
              fontSize={normalize(11)}
              letterSpacing={normalize(1.5)}
              marginTop={normalize(20)}
              title={'Skip'}
              width={'100%'}
            />
            {/* setscanmodal(false) */}
          </View>
        </View>
      </Modal>
      {/* </View> */}
      {/* </Fragment> */}
    </>
  );
}
