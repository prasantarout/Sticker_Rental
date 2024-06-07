import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest, takeEvery} from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  tokenRequest,
  tokenSuccess,
  tokenFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  profileRequest,
  profileSuccess,
  profileFailure,
  changepasswordRequest,
  changepasswordSuccess,
  changepasswordFailure,
  profileupdateRequest,
  profileupdateSuccess,
  profileupdateFailure,
  brandListSuccess,
  brandListFailure,
  brandItemListSuccess,
  brandItemListFailure,
  signUpEmailExistSuccess,
  signUpEmailExistFailure,
  signUpResponseSuccess,
  signUpResponseFailure,
  deleteAccountSuccess,
  deleteAccountFailure,
  checkVinAndLicenseSuccess,
  checkVinAndLicenseFailure,
  forgotPasswordSendEmailSuccess,
  forgotPasswordSendEmailFailure,
  resendOtpSuccess,
  resendOtpFailure,
  otpverificationSuccess,
  otpverificationFailure,
  forgotpasswordSuccess,
  forgotpasswordFailure,
  uploadCarImageSuccess,
  uploadCarImageFailure,
  viewCarImageSuccess,
  viewCarImageFailure,
  myStickerUpdateSuccess,
  myStickerUpdateFailure,
  myStickerViewSuccess,
  myStickerViewFailure,
  myStickerRemoveSuccess,
  myStickerRemoveFailure,
  getCarListSuccess,
  getCarListFailure,
  vehicleModelListSuccess,
  vehicleModelListFailure,
  stateListSuccess,
  stateListFailure,
  cityListSuccess,
  cityListFailure,
  addBankAccountSuccess,
  addBankAccountFailure,
  deleteBankAccountSuccess,
  deleteBankAccountFailure,
  bankListRequest,
  bankListSuccess,
  bankListFailure,
  earningListRequest,
  earningListSuccess,
  earningListFailure,
  contactUsRequest,
  contactUsSuccess,
  contactUsFailure,
  faqListRequest,
  faqListSuccess,
  faqListFailure,
  getCmsRequest,
  getCmsSuccess,
  getCmsFailure,
  totalDistanceRequest,
  totalDistanceSuccess,
  totalDistanceFailure,
} from '../reducer/AuthReducer';
import Toast from '../../utils/helpers/Toast';

// import Toast from '../../utiles/helpers/Toast';
import {
  deleteApi,
  getApi,
  postApi,
  putApi,
} from '../../utils/helpers/ApiRequest';
import {useState} from 'react';
import showErrorAlert from '../../utils/helpers/Toast';
let getItem = state => state.AuthReducer;
let token = '';

//login
export function* loginSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      postApi,
      'user/signin',
      action?.payload?.obj1,
      header,
    );

    if (response?.status == 200) {
      yield put(loginSuccess(response?.data));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      yield put(tokenSuccess(response?.data?.token));
      Toast('Logged in successfully');
      if (action?.payload?.remember == true) {
        //
        yield call(
          AsyncStorage.setItem,
          constants.CREAD,
          JSON.stringify({
            email: action?.payload?.obj1?.email ?? '',
            password: action?.payload?.obj1?.password ?? '',
          }),
        );
      } else {
        yield call(AsyncStorage.removeItem, constants.CREAD);
      }
    } else {
      yield put(loginFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(loginFailure(error));
    Toast(error?.response?.data?.message);
  }
}

//tokenSaga
export function* tokenSaga() {
  try {
    const response = yield call(AsyncStorage.getItem, constants.TOKEN);

    if (response != null) {
      yield put(tokenSuccess(response));
    } else {
      yield put(tokenFailure(null));
    }
  } catch (error) {
    yield put(tokenFailure(null));
  }
}
//logoutSaga
export function* logoutSaga() {
  const items = yield select(getItem);
  // console.log(items);
  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };

  try {
    let response = yield call(getApi, 'user/logout', header);

    if (response.status == 200) {
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      yield put(tokenSuccess(null));
      yield put(logoutSuccess('logout'));
      Toast('Logged out Successfully');
    } else {
      yield put(logoutFailure(response.data));
    }
  } catch (error) {
    console.log(error);
    if (error?.response?.data?.message == 'Unauthorised access request!') {
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      yield put(tokenSuccess(null));
      Toast('Logged out Successfully');
    }
    yield put(logoutFailure(error));
  }
}
//profileSaga
export function* profileSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(getApi, 'user/profile', header);

    if (response?.status == 200) {
      yield put(profileSuccess(response?.data));
    } else {
      yield put(profileFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(profileFailure(error));
    if (
      error?.response?.data?.message ==
      'Please complete your registration process!'
    ) {
      Toast('Please Signin');
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      yield put(tokenSuccess(null));
    } else {
      Toast(error?.response?.data?.message);
    }
  }
}

//changepasswordSaga
export function* changepasswordSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'user/change-password',
      action?.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(changepasswordSuccess(response?.data));
      Toast(response?.data?.message);
    } else {
      yield put(changepasswordFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(changepasswordFailure(error));
    Toast(error?.response?.data?.message);
  }
}

//profileupdateSaga
export function* profileupdateSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: items.tokenResponse,
  };
  console.log(action?.payload);
  try {
    let response = yield call(
      putApi,
      'user/update-profile',
      action?.payload,
      header,
    );
    console.log(response);
    if (response?.status == 200) {
      yield put(profileupdateSuccess(response?.data));
      console.log(response);
      Toast(response?.data?.message);
    } else {
      yield put(profileupdateFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(profileupdateFailure(error));
    Toast(error?.response?.data?.message);
  }
}

export function* brandListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(postApi, 'brand/list', action?.payload, header);
    if (response?.status == 200) {
      yield put(brandListSuccess(response?.data));
      console.log(response);
      // Toast(response?.data?.message);
    } else {
      yield put(brandListFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(brandListFailure(error));
    Toast(error?.response?.data?.message);
  }
}

export function* brandItemListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'brand/sticker/list',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(brandItemListSuccess(response?.data));
      console.log(response);
      // Toast(response?.data?.message);
    } else {
      yield put(brandItemListFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(brandItemListFailure(error));
    Toast(error?.response?.data?.message);
  }
}

export function* signUpResponseSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(postApi, 'user/signup', action?.payload, header);
    if (response?.status == 200) {
      yield put(signUpResponseSuccess(response?.data));
      console.log(response);
      Toast(response?.data?.message);
    } else {
      yield put(signUpResponseFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(signUpResponseFailure(error));
    Toast(error?.response?.data?.message);
  }
}

export function* signUpEmailExistSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'user/signup/check-exist',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(signUpEmailExistSuccess(response?.data));
      console.log(response);
      // Toast(response?.data?.message);
    } else {
      yield put(signUpEmailExistFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(signUpEmailExistFailure(error));
    Toast(error?.response?.data?.message);
  }
}

export function* checkVinAndLicenseSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'user/check-vehicle/vin-license-number-exist',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(checkVinAndLicenseSuccess(response?.data));
      console.log(response);
      Toast(response?.data?.message);
    } else {
      yield put(checkVinAndLicenseFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(checkVinAndLicenseFailure(error));
    Toast(error?.response?.data?.message);
  }
}

export function* deleteAccountSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(
      deleteApi,
      'user/profile/delete',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(deleteAccountSuccess(response?.data));
      console.log(response);
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      yield put(tokenSuccess(null));
      Toast(response?.data?.message);
    } else {
      yield put(deleteAccountFailure(response?.data));
      Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(deleteAccountFailure(error));
    Toast(error?.response?.data?.message);
  }
}

export function* ForgotPasswordSendEmailSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      postApi,
      'user/forgot-password',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(forgotPasswordSendEmailSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SignUpResponse,
      // );
      showErrorAlert(response.data.message);
    } else {
      yield put(forgotPasswordSendEmailFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(forgotPasswordSendEmailFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

export function* ResendForgotPasswordOtpSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      postApi,
      'user/resend-forgot-password-otp',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(resendOtpSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SignUpResponse,
      // );
      showErrorAlert(response.data.message);
    } else {
      yield put(resendOtpFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(resendOtpFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

export function* OtpVerificationSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      postApi,
      'user/otp-verification',
      action?.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(otpverificationSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SignUpResponse,
      // );
      showErrorAlert(response.data.message);
    } else {
      yield put(otpverificationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(otpverificationFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

export function* forgotPasswordSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'user/reset-password',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(forgotpasswordSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SignUpResponse,
      // );
      showErrorAlert(response.data.message);
    } else {
      yield put(forgotpasswordFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(forgotpasswordFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

export function* uploadCarImageSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'captur-car-image/submit',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(uploadCarImageSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SignUpResponse,
      // );
      showErrorAlert(response.data.message);
    } else {
      yield put(uploadCarImageFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(uploadCarImageFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

export function* viewCarImageSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      getApi,
      'captur-car-image/view',
      // action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(viewCarImageSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SignUpResponse,
      // );
      // showErrorAlert(response.data.message);
    } else {
      yield put(viewCarImageFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(viewCarImageFailure(error));
    // showErrorAlert(
    //   error?.response?.data?.message == 'Validation Error.'
    //     ? error?.response?.data?.data?.email[0]
    //     : error?.response?.data?.message,
    // );
  }
}

export function* myStickerUpdateSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'my-sticker/update',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(myStickerUpdateSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SignUpResponse,
      // );
      showErrorAlert(response.data.message);
    } else {
      yield put(myStickerUpdateFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(myStickerUpdateFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

export function* myStickerViewSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      getApi,
      'my-sticker/view',
      // action?.payload,
      header,
    );
    console.log(response, '>>>>>>response');
    if (response?.status == 200) {
      yield put(myStickerViewSuccess(response?.data));
    } else {
      yield put(myStickerViewFailure(response?.data));
      // showErrorAlert('No Data Found');
    }
  } catch (error) {
    yield put(myStickerViewFailure(error));
    // showErrorAlert('No Stickers Found');
    // showErrorAlert(
    //   error?.response?.data?.message == 'Validation Error.'
    //     ? error?.response?.data?.data?.email[0]
    //     : error?.response?.data?.message,
    // );
  }
}

export function* stateListViewSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      getApi,
      'state/list',
      // action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(stateListSuccess(response?.data));
    } else {
      yield put(stateListFailure(response?.data));
      showErrorAlert('No Data Found');
    }
  } catch (error) {
    yield put(stateListFailure(error));
    showErrorAlert('No Stickers Found');
    // showErrorAlert(
    //   error?.response?.data?.message == 'Validation Error.'
    //     ? error?.response?.data?.data?.email[0]
    //     : error?.response?.data?.message,
    // );
  }
}

export function* cityListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'state/city/list',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(cityListSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(cityListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(cityListFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

export function* myStickerRemoveSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'my-sticker/remove',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(myStickerRemoveSuccess(response?.data));
      showErrorAlert(response.data.message);
    } else {
      yield put(myStickerRemoveFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(myStickerRemoveFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

export function* mySticVehicleListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'vehicle/list', action?.payload, header);
    if (response?.status == 200) {
      yield put(getCarListSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(getCarListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(getCarListFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

export function* mySticVehicleModelListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'vehicle/model/list',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(vehicleModelListSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(vehicleModelListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(vehicleModelListFailure(error));
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

//ADD BANK ACCOUNT
export function* addBankAccountSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(getApi, 'user/add/bank/account', header);

    if (response?.status == 200) {
      yield put(addBankAccountSuccess(response?.data));
    } else {
      yield put(addBankAccountFailure(response?.data));
      // Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(addBankAccountFailure(error));
  }
}

//DELETE BANK ACCOUNT
export function* deleteBankAccountSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(
      deleteApi,
      'user/bank/account/delete',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(deleteBankAccountSuccess(response?.data));
      Toast(response?.data?.message);
    } else {
      yield put(deleteBankAccountFailure(response?.data));
    }
  } catch (error) {
    yield put(deleteBankAccountFailure(error));
  }
}

//BANK LIST
export function* bankListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(getApi, 'user/bank/account/list', header);

    if (response?.status == 200) {
      yield put(bankListSuccess(response?.data));
    } else {
      yield put(bankListFailure(response?.data));
      // Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(bankListFailure(error));
  }
}

//EARNING LIST
export function* earningListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'transaction/list',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(earningListSuccess(response?.data));
    } else {
      yield put(earningListFailure(response?.data));
      // Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(earningListFailure(error));
  }
}

//CONTACT US
export function* contactUsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(postApi, 'contact-us/create',action.payload, header);

    if (response?.status == 200) {
      yield put(contactUsSuccess(response?.data));
      Toast(response?.data?.message);
    } else {
      yield put(contactUsFailure(response?.data));
      // Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(contactUsFailure(error));
  }
}

//FAQ LIST
export function* faqListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(getApi, 'faq/list', header);

    if (response?.status == 200) {
      yield put(faqListSuccess(response?.data));
      // Toast(response?.data?.message);
    } else {
      yield put(faqListFailure(response?.data));
      // Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(faqListFailure(error));
  }
}

//CMS
export function* getCmsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(getApi, `cms/content/${action.payload}`, header);

    if (response?.status == 200) {
      yield put(getCmsSuccess(response?.data));
      // Toast(response?.data?.message);
    } else {
      yield put(getCmsFailure(response?.data));
      // Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(getCmsFailure(error));
  }
}


//SEND TOTAL DISTANCE
export function* totalDistanceSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.tokenResponse,
  };
  try {
    let response = yield call(getApi, `cms/content/${action.payload}`, header);

    if (response?.status == 200) {
      yield put(totalDistanceSuccess(response?.data));
      // Toast(response?.data?.message);
    } else {
      yield put(totalDistanceFailure(response?.data));
      // Toast(error?.response?.data?.message);
    }
  } catch (error) {
    yield put(totalDistanceFailure(error));
  }
}

///////////////////////////////
const watchFunction = [
  (function* () {
    yield takeLatest('Auth/loginRequest', loginSaga);
  })(), //tokenRequest
  (function* () {
    yield takeLatest('Auth/tokenRequest', tokenSaga);
  })(), //logoutRequest
  (function* () {
    yield takeLatest('Auth/logoutRequest', logoutSaga);
  })(), //profileRequest
  (function* () {
    yield takeLatest('Auth/profileRequest', profileSaga);
  })(), //changepasswordRequest
  (function* () {
    yield takeLatest('Auth/changepasswordRequest', changepasswordSaga);
  })(), //profileupdateRequest
  (function* () {
    yield takeLatest('Auth/profileupdateRequest', profileupdateSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/brandListRequest', brandListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/brandItemListRequest', brandItemListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/signUpResponseRequest', signUpResponseSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/signUpEmailExistRequest', signUpEmailExistSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/deleteAccountRequest', deleteAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/checkVinAndLicenseRequest', checkVinAndLicenseSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Auth/forgotPasswordSendEmailRequest',
      ForgotPasswordSendEmailSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Auth/resendOtpRequest', ResendForgotPasswordOtpSaga);
  })(),

  (function* () {
    yield takeLatest('Auth/otpverificationRequest', OtpVerificationSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/forgotpasswordRequest', forgotPasswordSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/uploadCarImageRequest', uploadCarImageSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/viewCarImageRequest', viewCarImageSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/myStickerUpdateRequest', myStickerUpdateSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/myStickerViewRequest', myStickerViewSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/myStickerRemoveRequest', myStickerRemoveSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/getCarListRequest', mySticVehicleListSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Auth/vehicleModelListRequest',
      mySticVehicleModelListSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Auth/stateListRequest', stateListViewSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/cityListRequest', cityListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/addBankAccountRequest', addBankAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/deleteBankAccountRequest', deleteBankAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/bankListRequest', bankListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/earningListRequest', earningListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/contactUsRequest', contactUsSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/faqListRequest', faqListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/getCmsRequest', getCmsSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/totalDistanceRequest', totalDistanceSaga);
  })(),
];

export default watchFunction;
