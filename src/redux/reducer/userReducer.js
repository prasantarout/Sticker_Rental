// reducers/userReducer.js
import {
  SET_PERSONAL_INFO,
  SET_CAR_INFO,
  SET_VEHICLE_INFO,
  SET_ADDRESS_INFO,
  SET_BRAND_INFO,
  SET_STICKER_INFO,
  RESET_PERSONAL_INFO,
  RESET_CAR_INFO,
  RESET_VEHICLE_INFO,
  RESET_ADDRESS_INFO,
} from '../action/Types';

const initialState = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  carInfo: {
    carName: '',
    modelNumber: '',
    vinNumber: '',
    licenseNumber: '',
    totalDoors: '',
    carId:'',
    modelId:''
  },
  vehicleInfo: {
    uploadDrivingLicense: null,
    uploadGovtIdCard: null,
    uploadCarImage: null,
    uploadVinNumberCar: null,
  },
  addressInfo: {
    address: '',
    city: '',
    state: '',
    zipcode: '',
  },

  bankDetails:{
    bankName:'',
    accountNumber:'',
  },

  brandInfo: {
    brand_id: '',
  },
  stickerInfo: {
    sticker_id: [],
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PERSONAL_INFO:
      return {...state, personalInfo: action.payload};
    case RESET_PERSONAL_INFO:
      return {...state, personalInfo: initialState.personalInfo};
    case SET_CAR_INFO:
      return {...state, carInfo: action.payload};
    case RESET_CAR_INFO:
      return {...state, carInfo: initialState.carInfo};
    case SET_VEHICLE_INFO:
      return {...state, vehicleInfo: action.payload};
    case RESET_VEHICLE_INFO:
      return {...state, vehicleInfo: initialState.vehicleInfo};
    case SET_ADDRESS_INFO:
      return {...state, addressInfo: action.payload};
    case RESET_ADDRESS_INFO:
      return {...state, addressInfo: initialState.addressInfo};
    case SET_BRAND_INFO:
      return {...state, brandInfo: action.payload};
    case SET_STICKER_INFO:
      return {...state, stickerInfo: action.payload};
    default:
      return state;
  }
};

export default userReducer;
