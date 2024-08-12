import {all} from 'redux-saga/effects';
import LocationSaga from './location.saga';

function* rootSaga() {
  yield all([LocationSaga()]);
}

export default rootSaga;
