import React, {useState} from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import normalize from '../utils/helpers/dimen';
import PropTypes from 'prop-types';
import {Icons, Colors, Fonts} from '../themes/ImagePath';

export default function Buttonfield(props) {
  function onChangeText(text) {
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  }
  function rightimagepress() {
    if (props.rightimagepress) {
      props.rightimagepress();
    }
  }

  function onFocus() {
    if (props.onFocus) {
      props.onFocus();
    }
  }
  function onBlur() {
    if (props.onBlur) {
      props.onBlur();
    }
  }

  function informationpress() {
    if (props.informationpress) {
      props.informationpress();
    }
  }

  return (
    <View
      style={{
        height: normalize(55),
        width: props.width ? props.width : '100%',
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        // borderColor: props?.focus ? Colors.button : Colors.bordercolor,
        // borderWidth: props.borderWidth,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginVertical: props.marginVertical,
        padding: normalize(11),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: normalize(15),
        justifyContent: 'space-between',
      }}>
      <View
        style={{alignItems: 'center', flexDirection: 'row', height: '100%'}}>
        <TextInput
          style={{
            color: Colors.white,
            fontSize: normalize(13),
            fontFamily: Fonts.Nunito_Medium,
            // letterSpacing:1,
            fontWeight: '600',
            // backgroundColor:'green',
            maxWidth: normalize(190),
            // width:normalize(190),
            // width:props?.isrightimage ?normalize(190):normalize(210),
            height: '100%',
            // marginLeft: Platform.OS == 'android' ? normalize(-3) : normalize(0),
            // backgroundColor:'red'
            // marginTop: Platform.OS == 'ios' ? normalize(7) : normalize(0),
          }}
          secureTextEntry={props.isSecure}
          multiline={props.multiline}
          placeholder={props.placeholder}
          editable={props.editable}
          placeholderTextColor="#A0A0A0" //{props.placeholderTextColor}
          keyboardType={props.keyboardType}
          // keyboardType='phone-pad'
          value={props.value}
          onFocus={() => onFocus()}
          onBlur={() => onBlur()}
          maxLength={props.maxLength}
          onChangeText={text => {
            onChangeText(text);
          }}
          scrollEnabled={props.multiline ? false : true}
        />
        {props.isleftimage && (
          <TouchableOpacity
            style={{marginLeft: normalize(5)}}
            onPress={() => informationpress()}>
            <Image
              source={Icons.information}
              style={{
                width: normalize(15),
                height: normalize(15),
                resizeMode: 'contain',

                // tintColor: Colors.textinputtext,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      {props.isrightimage && (
        <TouchableOpacity
          // style={{position: 'absolute', right: normalize(10)}}
          onPress={() => rightimagepress()}>
          <Image
            source={Icons.circlearrowdown}
            style={{
              width: props?.showhide ? normalize(15) : normalize(17),
              height: props?.showhide ? normalize(15) : normalize(17),
              resizeMode: 'contain',
              tintColor: Colors.textinputtext,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

Buttonfield.propTypes = {
  height: PropTypes.number,
  width: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  borderRadius: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginVertical: PropTypes.number,
  toptext: PropTypes.string,
  placeholder: PropTypes.string,
  isSecure: PropTypes.bool,
  placeholderTextColor: PropTypes.placeholderTextColor,
  keyboardType: PropTypes.string,
  value: PropTypes.string,
  multiline: PropTypes.bool,
  editable: PropTypes.bool,
  onChangeText: PropTypes.func,
  isrightimage: PropTypes.bool,
  rightimagepress: PropTypes.func,
  showhide: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  focus: PropTypes.bool,
  maxLength: PropTypes.number,
  isleftimage: PropTypes.bool,
  leftimage: PropTypes.string,
  informationpress: PropTypes.func,
};

Buttonfield.defaultProps = {
  height: normalize(60),
  width: '100%',
  borderRadius: normalize(8),
  borderWidth: normalize(1),
  borderColor: Colors.bordercolor,
  marginTop: normalize(15),
  isSecure: false,
  placeholderTextColor: Colors.placeholder,
  keyboardType: 'default',
  value: '',
  multiline: false,
  editable: true,
  onChangeText: null,
  toptext: '',
  isrightimage: false,
  rightimagepress: null,
  showhide: false,
  onFocus: null,
  onBlur: null,
  focus: false,
  maxLength: 300,
  backgroundColor: Colors.inputbackgroundcolor,
  isleftimage: false,
};
