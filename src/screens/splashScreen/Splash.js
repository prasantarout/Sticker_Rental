import React, {Fragment, useEffect} from 'react';
import {SafeAreaView, View, ImageBackground} from 'react-native';
import {Colors, Icons} from '../../themes/ImagePath';
import MyStatusBar from '../../utils/MyStatusBar';
import {useDispatch} from 'react-redux';
import {tokenRequest} from '../../redux/reducer/AuthReducer';
export default function Splash(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      // useEffect(()=>{
      dispatch(tokenRequest());
      //   },[])
    }, 2500);
  }, []);

  return (
    <Fragment>
      <MyStatusBar backgroundColor={Colors.themeColor} />
      <ImageBackground source={Icons.Splash} style={{flex: 1}} />
    </Fragment>
  );
}
