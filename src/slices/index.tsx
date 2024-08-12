import {LocationReducer} from './location.reducer';

export type Unpacked<T> = T extends (infer U)[] ? U : T;

const allReducers = {
  location: LocationReducer,
};

export default allReducers;
