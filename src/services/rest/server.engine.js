import axios from 'axios'
import { transformRequestOptions } from './../../helper/utils'
import { LocalStorageService } from './../localstorage.service'
import { isBrowser } from 'browser-or-node'
import { interceptorFn } from "./signature/axios_helper";
axios.defaults.withCredentials = true

let config = {}

/**
 * set axios config for SSR
 * @param {*} appConfig
 */
export const setAxiosConfig = (appConfig) => {
    config = appConfig
}
const getHeaders = (headers) => {
    return {
        'Content-Type': 'application/json',
        'x-currency-code': 'INR',
        'x-application-id': config && config.application && config.application._id, //'5c6cee5c1a02cd19864f26f5',
        'x-application-token': config && config.application && config.application.token, //'a4944690-34d5-11e9-9346-cb5a6b9cbf73'
        ...headers
    }
}

let engine = {}

engine.head = function(url, opt) {
    return axios.head(url, {
        headers: getHeaders(opt.headers),
        params: opt.params,
        paramsSerializer: (params) => {
            return transformRequestOptions(params)
        }
    })
}

engine.get = function(url, opt = {}, config = {}) {
    return axios.get(url, {
        params: opt.params,
        headers: getHeaders(opt.headers),
        paramsSerializer: (params) => {
            return transformRequestOptions(params)
        },
        ...config
    })
}

engine.post = function(url, opt) {
    return axios.post(url, opt.data, {
        headers: getHeaders(opt.headers),
        params: opt.params
    })
}

engine.put = function(url, opt) {
    return axios.put(url, opt.data, {
        headers: getHeaders(opt.headers),
        params: opt.params
    })
}

engine.patch = function(url, opt) {
    return axios.patch(url, opt.data, {
        headers: getHeaders(opt.headers),
        params: opt.params
    })
}

engine.del = function(url, opt = {}) {
    return axios.delete(url, {
        data: opt.data,
        headers: getHeaders(opt.headers),
        params: opt.params
    })
}

axios.interceptors.response.use(
    function(response) {
        return response
    },
    function(error) {
        if (401 === (error.response && error.response.status)) {
            //Gets into infinite loop,Fix it.
            //AuthService.onUserLoggedOut();
                eventHelper.forceLogout(error.request.responseURL)
                //analyticsHandler(fnTypes.RESET);
            if (isBrowser) {
                LocalStorageService.removeAll()
            }
        }
        return Promise.reject(error)
    }
)
axios.interceptors.request.use(interceptorFn({}));
export default engine
