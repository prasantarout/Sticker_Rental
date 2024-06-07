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
import {earningListRequest} from '../../redux/reducer/AuthReducer';
import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import moment from 'moment';

export default function Earning(props) {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(
          earningListRequest({
            page: 1,
            perpage: 50,
          }),
        );
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
      });
  }, []);

  const [data, setdata] = useState([
    {
      date: '17/08/2023',
      price: '35.0',
      success: 'Successful',
    },
    {
      date: '17/08/2023',
      price: '35.0',
      success: 'Successful',
    },
    {
      date: '17/08/2023',
      price: '35.0',
      success: 'Successful',
    },
    {
      date: '17/08/2023',
      price: '35.0',
      success: 'Successful',
    },
    {
      date: '17/08/2023',
      price: '35.0',
      success: 'Successful',
    },
    {
      date: '17/08/2023',
      price: '35.0',
      success: 'Successful',
    },
  ]);

  function renderdata({item, index}) {
    return (
      <View
        style={{
          width: '100%',
          height: normalize(50),
          backgroundColor: 'rgba(255,255,255,0.1)',
          marginTop: normalize(10),
          borderRadius: normalize(10),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: normalize(10),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: Fonts.RobotoLight,
              color: Colors.lightwhite,
              fontSize: normalize(11),
            }}>
            Date:{' '}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.RobotoMedium,
              color: Colors.white,
              fontSize: normalize(12),
            }}>
            {moment(item?.transaction_date).format('DD/MM/YYYY')}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: Fonts.RobotoMedium,
            color: Colors.white,
            fontSize: normalize(12),
          }}>
          {' '}
          ${item?.total_earning?.toFixed(1)}
        </Text>
        <View
          style={{
            backgroundColor: 'rgba(137,196,56,0.2)',
            width: normalize(75),
            height: normalize(25),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: normalize(6),
          }}>
          <Text
            style={{
              fontFamily: Fonts.RobotoMedium,
              color: '#89C438',
              fontSize: normalize(12),
            }}>
            Successful
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Fragment>
      <MyStatusBar />
      <ImageBackground style={{flex: 1}} source={Icons.Profileback}>
        <View style={{width: '90%', alignSelf: 'center'}}>
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
            Earning
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
              backgroundColor: 'rgba(255,255,255,0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90%',
              paddingVertical: normalize(15),
              alignSelf: 'center',
              borderRadius: normalize(15),
            }}>
            <Text
              style={{
                fontFamily: Fonts.RobotoSlabBold,
                fontSize: normalize(10),
                color: Colors.white,
                textAlign: 'center',
              }}>
              Total Earning
            </Text>
            <Text
              style={{
                fontFamily: Fonts.RobotoSlabBold,
                fontSize: normalize(25),
                color: Colors.lightblue,
                textAlign: 'center',
              }}>
              ${AuthReducer?.earningListRes?.totalEarnings?.toFixed(2)}
            </Text>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                height: normalize(60),
                borderWidth: 1,
                borderColor: 'rgba(105,179,255,0.3)',
                borderRadius: normalize(8),
                marginTop: normalize(20),
                backgroundColor: 'rgba(255,255,255,0.11)',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: normalize(10),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Icons.mile}
                  style={{width: normalize(35), height: normalize(35)}}
                />
                <View style={{marginLeft: normalize(7)}}>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoSlabBold,
                      fontSize: normalize(10),
                      color: Colors.lightwhite,
                    }}>
                    Total Miles
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoSlabBold,
                      fontSize: normalize(10),
                      color: Colors.white,
                    }}>
                    {AuthReducer?.earningListRes?.totalMilesCovered} km
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Icons.payment}
                  style={{width: normalize(35), height: normalize(35)}}
                />
                <View style={{marginLeft: normalize(7)}}>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoSlabBold,
                      fontSize: normalize(10),
                      color: Colors.lightwhite,
                    }}>
                    Last Payments
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoSlabBold,
                      fontSize: normalize(10),
                      color: Colors.white,
                    }}>
                    $
                    {AuthReducer?.earningListRes?.data?.length > 0
                      ? AuthReducer?.earningListRes?.data?.[0]?.total_earning?.toFixed(
                          2,
                        )
                      : '00.00'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              color: Colors.white,
              fontFamily: Fonts.RobotoSlabExtraBold,
              fontSize: normalize(13),
              width: '90%',
              alignSelf: 'center',
              marginTop: normalize(15),
            }}>
            History
          </Text>
          {AuthReducer?.earningListRes?.data?.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingBottom: normalize(20),
                //    marginTop:normalize(10)
              }}
              data={AuthReducer?.earningListRes?.data}
              style={{width: '90%', alignSelf: 'center'}}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={renderdata}
              horizontal={false}
            />
          ) : (
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.RobotoSlabExtraBold,
                fontSize: normalize(13),
                alignSelf: 'center',
                marginTop: normalize(15),
              }}>
              No History Found
            </Text>
          )}
        </ScrollView>
      </ImageBackground>
    </Fragment>
  );
}
