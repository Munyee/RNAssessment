import axios, {AxiosRequestConfig} from 'axios';
import {RequestAPI} from '../constants/ApiUrl.constants';

class HttpServices {
  sendRequest = async (API: RequestAPI, payload?: any) => {
    let config: AxiosRequestConfig = {
      ...API,
      headers: await this.setHeaders(),
    };

    if (API.method === 'GET' && payload) {
      config.params = payload;
    } else if (
      (API.method === 'POST' ||
        API.method === 'PUT' ||
        API.method === 'PATCH') &&
      payload
    ) {
      config.data = payload;
    }

    return new Promise<object>((resolve, reject) => {
      axios
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch(async (error: any) => {
          reject(error);
        });
    });
  };

  async setHeaders() {
    const headers: any = {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    };

    return {...headers};
  }
}

export const httpService = new HttpServices();
