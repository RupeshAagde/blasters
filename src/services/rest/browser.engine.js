import axios from 'axios';
import { transformRequestOptions } from './../../helper/utils';
import { LocalStorageService } from './../localstorage.service';
import { isBrowser } from 'browser-or-node';
import { interceptorFn } from "./signature/axios_helper";
axios.defaults.withCredentials = true

let axiosMisc = axios.create({
    withCredentials: false
})
let engine = {}

engine.head = function(url, opt) {
    return axios.head(url, {
        headers: opt.headers,
        params: opt.params,
        paramsSerializer: (params) => {
            return transformRequestOptions(params)
        }
    })
}

engine.get = function(url, opt = {}, config = {}) {
    return axios.get(url, {
        params: opt.params,
        headers: opt.headers,
        paramsSerializer: (params) => {
            return transformRequestOptions(params)
        },
        ...config,
    })
}

engine.post = function(url, opt) {
    return axios.post(url, opt.data, {
        headers: opt.headers,
        params: opt.params
    })
}

engine.put = function(url, opt) {
    return axios.put(url, opt.data, {
        headers: opt.headers,
        params: opt.params
    })
}

engine.patch = function(url, opt) {
    return axios.patch(url, opt.data, {
        headers: opt.headers,
        params: opt.params
    })
}

engine.del = function(url, opt = {}) {
    return axios.delete(url, {
        data: opt.data,
        headers: opt.headers,
        params: opt.params
    })
}

engine.getMisc = function(url, opt) {
    return axiosMisc.get(url, {
        params: opt.params,
        headers: opt.headers,
        paramsSerializer: (params) => {
            return transformRequestOptions(params)
        }
    })
}

engine.postMisc = function(url, opt) {
    return axiosMisc.post(url, opt.data, { headers: opt.headers })
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
