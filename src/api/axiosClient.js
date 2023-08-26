import axios from 'axios';
import { parse, stringify } from 'qs';
import { toast } from 'react-toastify';
import apiConfig from './apiConfig';

const axiosClient = axios.create({
    baseURL: apiConfig.baseURL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Origin, X-Auth-Token, Authorization',
        token: `Bearer ${sessionStorage.getItem('mynhbake_token')}`,
    },
    paramsSerializer: {
        encode: parse,
        serialize: stringify,
    },
});

axiosClient.interceptors.request.use(
    async (config) => {
        const token = sessionStorage.getItem('mynhbake_token');
        if (token) {
            config.headers['token'] = `Bearer ${token}`;
        }
        return {
            ...config,
        };
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosClient.interceptors.response.use(
    function (response) {
        return response && response.data ? response.data : response;
    },
    function (error) {
        const status = error.response?.status || 500;
        // we can handle global errors here
        switch (status) {
            // authentication (token related issues)
            case 401: {
                if (
                    window.location.pathname !== '/' &&
                    window.location.pathname !== '/login' &&
                    window.location.pathname !== '/register'
                ) {
                    toast.error('Unauthorized the user. Please login .....');
                }

                return error.response.data;
            }

            // forbidden (permission related issues)
            case 403: {
                toast.error('Bạn không có quyền truy cập tài nguyên này!');
                return Promise.reject(error);
            }

            // bad request
            case 400: {
                toast.error(error.response.data.message);
                return Promise.reject(error);
            }

            // not found
            case 404: {
                return Promise.reject(error);
            }

            // conflict
            case 409: {
                return Promise.reject(error);
            }

            // unprocessable
            case 422: {
                return Promise.reject(error);
            }

            // generic api error (server related) unexpected
            default: {
                // console.log('check error axios  : ', error);
                return Promise.reject(error);
            }
        }
    },
);

export const Instagram = axios.create({
    baseURL: 'https://graph.instagram.com/',
});

Instagram.interceptors.request.use(async (config) => config);

Instagram.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        throw error;
    },
);

export const GHN = axios.create({
    baseURL: 'https://online-gateway.ghn.vn/shiip/public-api/',
    headers: {
        'Content-Type': 'application/json',
        Token: process.env.REACT_APP_TOKEN_GHN,
        ShopId: process.env.REACT_APP_SHOPID,
    },
});

GHN.interceptors.request.use(async (config) => config);

GHN.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        throw error;
    },
);

export default axiosClient;
