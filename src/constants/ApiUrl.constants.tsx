import {config} from '../config';

export interface RequestAPI {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}
interface ApiPathList {
  [path: string]: RequestAPI;
}

export const API_DOMAIN = {
  GOOGLE: config.google_domain,
};

export const API_PATH_LIST: ApiPathList = {
  SEARCH_PLACE: {
    url: API_DOMAIN.GOOGLE + '/place/autocomplete/json',
    method: 'GET',
  },
  GET_PLACE_DETAIL: {
    url: API_DOMAIN.GOOGLE + '/place/details/json',
    method: 'GET',
  },
};
