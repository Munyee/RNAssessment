import {createAction, PayloadAction} from '@reduxjs/toolkit';
import {Keyboard} from 'react-native';
import {call, put, takeLatest} from 'redux-saga/effects';
import {config} from '../config';
import {API_PATH_LIST} from '../constants/ApiUrl.constants';
import {httpService} from '../services/HTTP.service';
import {
  setLocationDetail,
  setOpenSearch,
  setPredictLocations,
} from '../slices/location.reducer';

interface PredictLocation {
  input: string;
}

export function* searchPredictLocationByInput(
  action: PayloadAction<PredictLocation>,
) {
  try {
    const {input} = action.payload;
    const {data} = yield call(
      httpService.sendRequest,
      API_PATH_LIST.SEARCH_PLACE,
      {
        input: input,
        key: config.API_KEY,
      },
    );

    if (data) {
      console.log(data.predictions);
      yield put(setPredictLocations(data.predictions));
    }
  } catch (e) {
    //Error handling
  }
}

export function* getLocationDetailByPlaceId(action: PayloadAction<string>) {
  try {
    const {data} = yield call(
      httpService.sendRequest,
      API_PATH_LIST.GET_PLACE_DETAIL,
      {
        place_id: action.payload,
        key: config.API_KEY,
      },
    );

    if (data) {
      yield put(setLocationDetail(data.result));
    }
  } catch (e) {
    //Error handling
  } finally {
    yield put(setOpenSearch(false));
    Keyboard.dismiss();
  }
}

export const searchPredictLocationByInputAction = createAction<PredictLocation>(
  'searchPredictLocationByInput',
);
export const getLocationDetailByPlaceIdAction = createAction<string>(
  'getLocationDetailByPlaceId',
);

export function* LocationSaga() {
  yield takeLatest(
    searchPredictLocationByInputAction,
    searchPredictLocationByInput,
  );
  yield takeLatest(
    getLocationDetailByPlaceIdAction,
    getLocationDetailByPlaceId,
  );
}

export default LocationSaga;
