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
        return ApiService.put(URLS.EXTENSION_HOME(), axiosOptions);
    },
    getSections(params = {}) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.EXTENSION_HOME(), axiosOptions);
    },
    getPublicExtensions(params = {}) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_PUBLIC_EXTENSIONS(), axiosOptions);
    },
    getCollections(params = {}) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_EXTENSION_COLLECTIONS(), axiosOptions);
    },
    getCategories(params = {}) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.PUBLIC_EXTENSION_CATEGORIES(), axiosOptions);
    },
    fetchCollectionExtensions(params = {}, id) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_COLLECTION_EXTENSIONS(id), axiosOptions);
    }
}

export default ExtensionPageService;