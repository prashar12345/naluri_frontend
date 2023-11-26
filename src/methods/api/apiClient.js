/*
 * @file: index.js
 * @description: It Contain rest functions for api call .
 * @author: Poonam
 */

import axios from 'axios';
import querystring from 'querystring';
import { setAuthorizationToken } from '../auth';
import { ToastsStore } from 'react-toasts';
import loader from '../loader';
import ApiKey from '../ApiKey';


var config = {
    headers: { 'Content-Type': 'application/json' },
};

var baseUrl = ApiKey.api

const handleError = (err, hideError) => {
    let message = ''
    if (err) {
        if (err && err.error && err.error.code === 401) {
            // localStorage.clear()
            // window.location.assign("/");
        }
        message = err && err.error && err.error.message
        if (!message) message = err.message
        if (!message) message = 'Server Error'
    }
    if (!hideError) ToastsStore.error(message);
}

class ApiClient {
    static post(url1, params, base = '') {
        let url = baseUrl + url1
        if (base) url = base + url1

        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            axios
                .post(url, JSON.stringify(params), config)
                .then(function (response) {
                    fulfill(response && response.data);
                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data)
                        fulfill(eres.data);
                    } else {
                        ToastsStore.error('Network Error');
                        reject(error);
                    }
                });
        });
    }

    static put(url1, params, base = '') {
        let url = baseUrl + url1
        if (base) url = base + url1
        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            axios
                .put(url, JSON.stringify(params), config)
                .then(function (response) {
                    fulfill(response && response.data);
                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data)
                        fulfill(eres.data);
                    } else {
                        ToastsStore.error('Network Error');
                        reject(error);
                    }
                });
        });
    }

    static get(url1, params = {}, base = '', hideError = '') {

        let url = baseUrl + url1
        if (base) url = base + url1

        let query = querystring.stringify(params);
        url = query ? `${url}?${query}` : url;
        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            axios
                .get(url, config)
                .then(function (response) {
                    if (response && response.data) {
                        fulfill(response && response.data);
                    } else {
                        fulfill({ success: false });
                    }

                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data, hideError)
                        fulfill({ ...eres.data, success: false });
                    } else {
                        ToastsStore.error('Network Error');
                        reject(error);
                    }
                });
        });
    }

    static delete(url1, params = {}, base = '') {
        let url = baseUrl + url1
        if (base) url = base + url1

        let query = querystring.stringify(params);
        url = query ? `${url}?${query}` : url;
        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            axios
                .delete(url, config)
                .then(function (response) {
                    fulfill(response && response.data);
                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data)
                        fulfill(eres.data);
                    } else {
                        ToastsStore.error('Network Error');
                        reject(error);
                    }
                });
        });
    }

    static allApi(url, params, method = 'get') {
        if (method === 'get') {
            return this.get(url, params)
        } else if (method === 'put') {
            return this.put(url, params)
        } if (method === 'post') {
            return this.post(url, params)
        }
    }

    /*************** Form-Data Method ***********/
    static postFormData(url, params) {
        url = baseUrl + url
        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            var body = new FormData();
            let oArr = Object.keys(params)
            oArr.forEach(itm => {
                body.append(itm, params[itm]);
            })

            axios
                .post(url, body, config)

                .then(function (response) {
                    fulfill(response && response.data);
                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data)
                        fulfill(eres.data);
                    } else {
                        ToastsStore.error('Network Error');
                        reject(error);
                    }
                });
        });
    }

    static dropoff(page = '', user = {}) {
        let payload = {
            page: page,
            userId: user.id,
            sessionToken: user.access_token
        }
        this.post('dropoff', payload).then(res => {

        })
    }
}

export default ApiClient;
