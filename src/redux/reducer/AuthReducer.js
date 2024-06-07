import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  error: {},
  loginResponse: {},
  tokenResponse: {},
  logoutResponse: {},
  profileResponse: {},
  changepasswordResponse: {},
  profileupdateResponse: {},
  brandListResponse: {},
  brandItemListResponse: {},
  signUpResponse: {},
  signUpEmailExistResponse: {},
  deleteAccountRes: {},
  checkVinAndLicenseResponse: {},

  forgotPasswordResponse: {},
  otpVerificationResponse: {},
  resendOtpResponse: {},
  resetPasswordResponse: {},
  uploadCarImageResponse: {},
  viewCarImageResponse: {},
  myStickerUpdateResponse: {},
  myStickerViewResponse: {},
  stickerRemoveRes: {},
  cardListRes: {},
  vehicleModelListRes: {},
  stateListRes: {},
  cityListRes: {},
  addBankAccountRes:{},
  deleteBankAccountRes:{},
  bankListRes:[],
  earningListRes:{},
  contactUsRes:{},
  faqListRes:{},
  getCmsRes:{},
  totalDistanceRes:null,

};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    //login
    loginRequest(state, action) {
      state.status = action.type;
    },
    loginSuccess(state, action) {
      state.loginResponse = action.payload;
      state.status = action.type;
    },
    loginFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //token
    tokenRequest(state, action) {
      state.status = action.type;
      state.isLoading = true;
    },
    tokenSuccess(state, action) {
      // console.log(action);
      state.tokenResponse = action.payload;
      state.status = action.type;
      state.isLoading = false;
    },
    tokenFailure(state, action) {
      state.tokenResponse = action.payload;
      state.error = action.error;
      state.status = action.type;
      state.isLoading = false;
    },

    //logout
    logoutRequest(state, action) {
      state.status = action.type;
    },
    logoutSuccess(state, action) {
      state.logoutResponse = action.payload;
      state.status = action.type;
    },
    logoutFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //profile
    profileRequest(state, action) {
      state.status = action.type;
    },
    profileSuccess(state, action) {
      state.profileResponse = action.payload;
      state.status = action.type;
    },
    profileFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //changepassword
    changepasswordRequest(state, action) {
      state.status = action.type;
    },
    changepasswordSuccess(state, action) {
      state.changepasswordResponse = action.payload;
      state.status = action.type;
    },
    changepasswordFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //profileupdate
    profileupdateRequest(state, action) {
      state.status = action.type;
    },
    profileupdateSuccess(state, action) {
      state.profileupdateResponse = action.payload;
      state.status = action.type;
    },
    profileupdateFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //profileupdate
    brandListRequest(state, action) {
      state.status = action.type;
    },
    brandListSuccess(state, action) {
      state.brandListResponse = action.payload;
      state.status = action.type;
    },
    brandListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    brandItemListRequest(state, action) {
      state.status = action.type;
    },
    brandItemListSuccess(state, action) {
      state.brandItemListResponse = action.payload;
      state.status = action.type;
    },
    brandItemListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // signup response
    signUpResponseRequest(state, action) {
      state.status = action.type;
    },
    signUpResponseSuccess(state, action) {
      state.signUpResponse = action.payload;
      state.status = action.type;
    },
    signUpResponseFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // signup response
    signUpEmailExistRequest(state, action) {
      state.status = action.type;
    },
    signUpEmailExistSuccess(state, action) {
      state.signUpEmailExistResponse = action.payload;
      state.status = action.type;
    },
    signUpEmailExistFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // signup response
    deleteAccountRequest(state, action) {
      state.status = action.type;
    },
    deleteAccountSuccess(state, action) {
      state.deleteAccountRes = action.payload;
      state.status = action.type;
    },
    deleteAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // signup response
    checkVinAndLicenseRequest(state, action) {
      state.status = action.type;
    },
    checkVinAndLicenseSuccess(state, action) {
      state.checkVinAndLicenseResponse = action.payload;
      state.status = action.type;
    },
    checkVinAndLicenseFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // forgot password
    forgotPasswordSendEmailRequest(state, action) {
      state.status = action.type;
    },
    forgotPasswordSendEmailSuccess(state, action) {
      state.forgotPasswordResponse = action.payload;
      state.status = action.type;
    },
    forgotPasswordSendEmailFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // forgot password
    otpverificationRequest(state, action) {
      state.status = action.type;
    },
    otpverificationSuccess(state, action) {
      state.otpVerificationResponse = action.payload;
      state.status = action.type;
    },
    otpverificationFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //resend otp verification
    resendOtpRequest(state, action) {
      state.status = action.type;
    },
    resendOtpSuccess(state, action) {
      state.resendOtpRes = action.payload;
      state.status = action.type;
    },
    resendOtpFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //forgot password
    forgotpasswordRequest(state, action) {
      state.status = action.type;
    },
    forgotpasswordSuccess(state, action) {
      state.resetPasswordResponse = action.payload;
      state.status = action.type;
    },
    forgotpasswordFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //upload car image
    uploadCarImageRequest(state, action) {
      state.status = action.type;
    },
    uploadCarImageSuccess(state, action) {
      state.uploadCarImageResponse = action.payload;
      state.status = action.type;
    },
    uploadCarImageFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //upload car image
    viewCarImageRequest(state, action) {
      state.status = action.type;
    },
    viewCarImageSuccess(state, action) {
      state.viewCarImageResponse = action.payload;
      state.status = action.type;
    },
    viewCarImageFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //upload car image
    myStickerUpdateRequest(state, action) {
      state.status = action.type;
    },
    myStickerUpdateSuccess(state, action) {
      state.myStickerUpdateResponse = action.payload;
      state.status = action.type;
    },
    myStickerUpdateFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //my sticker view response
    myStickerViewRequest(state, action) {
      state.status = action.type;
    },
    myStickerViewSuccess(state, action) {
      state.myStickerViewResponse = action.payload;
      state.status = action.type;
    },
    myStickerViewFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //my sticker remove response
    myStickerRemoveRequest(state, action) {
      state.status = action.type;
    },
    myStickerRemoveSuccess(state, action) {
      state.stickerRemoveRes = action.payload;
      state.status = action.type;
    },
    myStickerRemoveFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //my sticker remove response
    getCarListRequest(state, action) {
      state.status = action.type;
    },
    getCarListSuccess(state, action) {
      state.cardListRes = action.payload;
      state.status = action.type;
    },
    getCarListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //my sticker remove response
    vehicleModelListRequest(state, action) {
      state.status = action.type;
    },
    vehicleModelListSuccess(state, action) {
      state.vehicleModelListRes = action.payload;
      state.status = action.type;
    },
    vehicleModelListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //my sticker remove response
    stateListRequest(state, action) {
      state.status = action.type;
    },
    stateListSuccess(state, action) {
      state.stateListRes = action.payload;
      state.status = action.type;
    },
    stateListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    cityListRequest(state, action) {
      state.status = action.type;
    },
    cityListSuccess(state, action) {
      state.cityListRes = action.payload;
      state.status = action.type;
    },
    cityListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //ADD BANK ACCOUNT
    addBankAccountRequest(state, action) {
      state.status = action.type;
    },
    addBankAccountSuccess(state, action) {
      state.addBankAccountRes = action.payload;
      state.status = action.type;
    },
    addBankAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

     //DELETE BANK ACCOUNT
     deleteBankAccountRequest(state, action) {
      state.status = action.type;
    },
    deleteBankAccountSuccess(state, action) {
      state.deleteBankAccountRes = action.payload;
      state.status = action.type;
    },
    deleteBankAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

     //BANK ACCOUNT LIST
     bankListRequest(state, action) {
      state.status = action.type;
      state.bankListRes = [];
    },
    bankListSuccess(state, action) {
      state.bankListRes = action.payload;
      state.status = action.type;
    },
    bankListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //EARNING LIST
    earningListRequest(state, action) {
      state.status = action.type;
    },
    earningListSuccess(state, action) {
      state.earningListRes = action.payload;
      state.status = action.type;
    },
    earningListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

     //CONTACT US
     contactUsRequest(state, action) {
      state.status = action.type;
    },
    contactUsSuccess(state, action) {
      state.contactUsRes = action.payload;
      state.status = action.type;
    },
    contactUsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

     //FAQ LIST
     faqListRequest(state, action) {
      state.status = action.type;
    },
    faqListSuccess(state, action) {
      state.faqListRes = action.payload;
      state.status = action.type;
    },
    faqListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

     //CMS LIST
     getCmsRequest(state, action) {
      state.status = action.type;
    },
    getCmsSuccess(state, action) {
      state.getCmsRes = action.payload;
      state.status = action.type;
    },
    getCmsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

     //SEND TOTAL DISTANCE
     totalDistanceRequest(state, action) {
      state.status = action.type;
    },
    totalDistanceSuccess(state, action) {
      state.totalDistanceRes = action.payload;
      state.status = action.type;
    },
    totalDistanceFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

  },
});

export const {
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

  brandListRequest,
  brandListSuccess,
  brandListFailure,

  brandItemListRequest,
  brandItemListSuccess,
  brandItemListFailure,

  signUpResponseRequest,
  signUpResponseSuccess,
  signUpResponseFailure,

  signUpEmailExistRequest,
  signUpEmailExistSuccess,
  signUpEmailExistFailure,

  deleteAccountRequest,
  deleteAccountSuccess,
  deleteAccountFailure,

  checkVinAndLicenseRequest,
  checkVinAndLicenseSuccess,
  checkVinAndLicenseFailure,

  forgotPasswordSendEmailRequest,
  forgotPasswordSendEmailFailure,
  forgotPasswordSendEmailSuccess,

  otpverificationRequest,
  otpverificationSuccess,
  otpverificationFailure,

  resendOtpRequest,
  resendOtpSuccess,
  resendOtpFailure,

  forgotpasswordRequest,
  forgotpasswordFailure,
  forgotpasswordSuccess,

  uploadCarImageRequest,
  uploadCarImageSuccess,
  uploadCarImageFailure,

  viewCarImageRequest,
  viewCarImageSuccess,
  viewCarImageFailure,

  myStickerUpdateRequest,
  myStickerUpdateSuccess,
  myStickerUpdateFailure,

  myStickerViewRequest,
  myStickerViewSuccess,
  myStickerViewFailure,

  myStickerRemoveRequest,
  myStickerRemoveSuccess,
  myStickerRemoveFailure,

  getCarListRequest,
  getCarListSuccess,
  getCarListFailure,

  vehicleModelListRequest,
  vehicleModelListSuccess,
  vehicleModelListFailure,

  stateListRequest,
  stateListSuccess,
  stateListFailure,

  cityListRequest,
  cityListSuccess,
  cityListFailure,

  addBankAccountRequest,
  addBankAccountSuccess,
  addBankAccountFailure,

  deleteBankAccountRequest,
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
} = AuthSlice.actions;

export default AuthSlice.reducer;
