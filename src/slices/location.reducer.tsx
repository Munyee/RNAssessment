import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Location {
  description: string;
  place_id: string;
}

interface LocationDetail {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  adr_address: string;
  business_status: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  rating: number;
  reference: string;
  reviews: {
    author_name: string;
    author_url: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
    translated: boolean;
  }[];
  types: string[];
  url: string;
  user_ratings_total: number;
  utc_offset: number;
  vicinity: string;
}

interface InitialState {
  predictLocations: Location[] | null;
  locationDetail: LocationDetail | null;
  searchHistory: Location[] | null;
  openSeach: boolean;
}

const initialState: InitialState = {
  predictLocations: null,
  locationDetail: null,
  searchHistory: null,
  openSeach: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setPredictLocations: (
      state,
      action: PayloadAction<InitialState['predictLocations']>,
    ) => {
      state.predictLocations = action.payload;
    },
    setLocationDetail: (
      state,
      action: PayloadAction<InitialState['locationDetail']>,
    ) => {
      state.locationDetail = action.payload;
    },
    setSearchHistory: (
      state,
      action: PayloadAction<InitialState['searchHistory']>,
    ) => {
      state.searchHistory = action.payload;
    },
    setOpenSearch: (
      state,
      action: PayloadAction<InitialState['openSeach']>,
    ) => {
      state.openSeach = action.payload;
    },
  },
});

export const LocationReducer = locationSlice.reducer;
export const {
  setPredictLocations,
  setLocationDetail,
  setSearchHistory,
  setOpenSearch,
} = locationSlice.actions;
