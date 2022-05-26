'use strict';

import URLS from './mixmaster-url.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const ExtensionPageService = {
    getAvailableSections(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_AVAILABLE_SECTIONS(), axiosOptions);
    },
    updateSections(payload, params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions(),
            {
                data: payload
            }
        );
        return ApiService.put(URLS.UPDATE_EXTENSION_SECTIONS(), axiosOptions);
    },
    getSections(params = {}) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.UPDATE_EXTENSION_SECTIONS(), axiosOptions);
    },
    getPublicExtensions(params = {}) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_PUBLIC_EXTENSIONS(), axiosOptions);
    }
}

export default ExtensionPageService;