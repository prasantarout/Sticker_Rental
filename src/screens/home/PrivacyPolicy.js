import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  FlatList,
  Platform,
  useWindowDimensions,
} from 'react-native';
import MyStatusBar from '../../utils/MyStatusBar';
import {ImageBackground} from 'react-native';
import {Colors, Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {earningListRequest, getCmsRequest} from '../../redux/reducer/AuthReducer';
import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import moment from 'moment';
import RenderHTML from 'react-native-render-html';

export default function PrivacyPolicy(props) {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [selected, setSelected] = useState(-1);
  const {widths} = useWindowDimensions();

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(
          getCmsRequest('privacy-policy'),
        );
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
      });
  }, []);


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
            Privacy Policy
          </Text>
        </View>
        <ScrollView
          style={{backgroundColor: Colors.statusbar, marginTop: normalize(30)}}
          contentContainerStyle={{
            paddingTop: normalize(15),
            paddingBottom: normalize(30),
            paddingHorizontal: normalize(15),
          }}
          showsVerticalScrollIndicator={false}>
          <RenderHTML
            contentWidth={widths}
            source={{
              html: AuthReducer?.getCmsRes?.data?.content,
            }}
            enableExperimentalMarginCollapsing={true}
            baseStyle={{
                color: Colors.white,
                fontFamily: Fonts.RobotoRegular,
                fontSize: normalize(12),
              }}
              tagsStyles={{
                p: {
                  color: Colors.white,
                },
                strong: {
                  color: Colors.white,
                },
                span: {
                  color: Colors.white,
                  fontSize: normalize(12),
                },
                li: {
                  color: Colors.white,
                },
                a: {
                  color: Colors.white,
                },
                h1: {
                  color: Colors.white,
                },
                h2: {
                  color: Colors.white,
                },
                h3: {
                  color: Colors.white,
                },
                h4: {
                  color: Colors.white,
                },
                h5: {
                  color: Colors.white,
                },
                h6: {
                  color: Colors.white,
                },
                img: {
                  resizeMode: 'contain',
                  maxWidth: normalize(285),
                },
              }}
          />
          
        </ScrollView>
      </ImageBackground>
    </Fragment>
  );
}
