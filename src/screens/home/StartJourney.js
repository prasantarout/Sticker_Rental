import {StyleSheet, Text, View} from 'react-native';
import React, {Fragment} from 'react';
import MyStatusBar from '../../utils/MyStatusBar';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/ImagePath';
import ButtonCom from '../../components/ButtonCom';

const StartJourney = props => {
  return (
    <>
      <Fragment>
        <MyStatusBar />
        <View style={{flex: 1}}>
          <MapView
            showsTraffic
            showsUserLocation
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{
              width: '100%',
              height: '100%',
            }}
            region={{
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}></MapView>
        </View>

        <View style={[styles.startBtnOuter]}>
          <ButtonCom
            onPress={() => props?.navigation?.navigate('Home')}
            backgroundColor={Colors.blue}
            fontSize={normalize(11)}
            letterSpacing={normalize(1.5)}
            marginTop={normalize(20)}
            title={`Start`}
            width={'50%'}
          />
        </View>
      </Fragment>
    </>
  );
};

export default StartJourney;

const styles = StyleSheet.create({
  startBtnOuter: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
