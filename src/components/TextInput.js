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

export default function TextInputItem(props) {
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

  return (
    <View
      style={{
        height: props.height,
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
        {props.isleftimage && (
          <Image
            source={props.leftimage}
            style={{
              width: normalize(15),
              height: normalize(15),
              resizeMode: 'contain',
              marginRight: normalize(13),
              // tintColor: Colors.textinputtext,
            }}
          />
        )}
        <TextInput
          style={{
            color: Colors.white,
            fontSize: normalize(13),
            fontFamily: Fonts.Nunito_Medium,
            // letterSpacing:1,
            fontWeight: '600',
            // backgroundColor:'green',
            width: props?.isrightimage ? normalize(190) : normalize(210),
            height: '100%',
            // marginLeft: Platform.OS == 'android' ? normalize(-3) : normalize(0),
            // backgroundColor:'red'
            //  marginTop: Platform.OS == 'ios' ? normalize(0) :props.multiline? normalize(-60):normalize(0),
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
          textAlignVertical="top"
        />
      </View>
      {props.isrightimage && (
        <TouchableOpacity
          // style={{position: 'absolute', right: normalize(10)}}
          onPress={() => rightimagepress()}>
          <Image
            source={props?.showhide ? Icons.eyeclose : Icons.eyeopen}
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

TextInputItem.propTypes = {
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
};

TextInputItem.defaultProps = {
  height: normalize(55),
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
