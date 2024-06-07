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
import {
  earningListRequest,
  faqListRequest,
} from '../../redux/reducer/AuthReducer';
import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import moment from 'moment';

export default function Faq(props) {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(faqListRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
      });
  }, []);

  function renderdata({item, index}) {
    return (
      <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        selected == index ? setSelected(-1) : setSelected(index);
      }}
        style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          width: '100%',
          padding: normalize(15),
          alignSelf: 'center',
          borderRadius: normalize(8),
          marginVertical: normalize(5),
        }}>
        <View
         
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: normalize(8),
            flexDirection: 'row',
            marginVertical: normalize(5),
          }}>
          <Text
            style={{
              fontFamily: Fonts.RobotoMedium,
              fontSize: normalize(12),
              color: Colors.white,
              textAlign: 'center',
            }}>
            {item?.question}
          </Text>

          <Image
            resizeMode="contain"
            source={Icons.rightarrow}
            style={{
              height: normalize(10),
              width: normalize(10),
              transform:
                index == selected ? [{rotate: '270deg'}] : [{rotate: '90deg'}],
            }}
          />
        </View>
        {index == selected ? (
          <Text
            style={{
              fontFamily: Fonts.RobotoLight,
              fontSize: normalize(12),
              color: Colors.white,
            }}>
            {item?.answer}
          </Text>
        ) : null}
      </TouchableOpacity>
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
            FAQ
          </Text>
        </View>
        <ScrollView
          style={{backgroundColor: Colors.statusbar, marginTop: normalize(30)}}
          contentContainerStyle={{
            paddingTop: normalize(15),
            paddingBottom: normalize(30),
          }}
          showsVerticalScrollIndicator={false}>
          {AuthReducer?.faqListRes?.data?.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingBottom: normalize(20),
                //    marginTop:normalize(10)
              }}
              data={AuthReducer?.faqListRes?.data}
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
              No Data Found
            </Text>
          )}
        </ScrollView>
      </ImageBackground>
    </Fragment>
  );
}
