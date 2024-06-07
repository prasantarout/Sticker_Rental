// actions/userActions.js
import {
  SET_PERSONAL_INFO,
  SET_CAR_INFO,
  SET_VEHICLE_INFO,
  SET_ADDRESS_INFO,
  SET_BRAND_INFO,
  SET_STICKER_INFO,
  RESET_PERSONAL_INFO,
  RESET_ADDRESS_INFO,
  RESET_CAR_INFO,
  RESET_VEHICLE_INFO,
} from './Types';

export const setPersonalInfo = personalInfo => ({
  type: SET_PERSONAL_INFO,
  payload: personalInfo,
});

export const setCarInfo = carInfo => ({
  type: SET_CAR_INFO,
  payload: carInfo,
});

export const setVehicleInfo = vehicleInfo => ({
  type: SET_VEHICLE_INFO,
  payload: vehicleInfo,
});

export const setAddressInfo = addressInfo => ({
  type: SET_ADDRESS_INFO,
  payload: addressInfo,
});

export const setBrandInfo = brandInfo => ({
  type: SET_BRAND_INFO,
  payload: brandInfo,
});

export const setStickerInfo = stickerInfo => ({
  type: SET_STICKER_INFO,
  payload: stickerInfo,
});



export const resetPersonalInfo = () => ({
  type: RESET_PERSONAL_INFO,
});

export const resetAddressInfo=()=>({
  type:RESET_ADDRESS_INFO,
})

export const resetCarInfo=()=>({
  type:RESET_CAR_INFO,
})
export const resetVehicleInfo=()=>({
  type:RESET_VEHICLE_INFO
})