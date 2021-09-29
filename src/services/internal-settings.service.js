'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const InternalSettingsService = {
    getBasicSettings() {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_BASIC_DETAILS(), axiosOptions);
    },
    updateBasicSettings(data) {
        const axiosOptions = Object.assign({}, { data },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_BASIC_DETAILS_UPDATE(), axiosOptions);
    },
    getNavbar() {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_NAVBAR(), axiosOptions);
    },

    getDefaultNavbar() {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_DEFAULT_NAVBAR(), axiosOptions);
    },
    getCustomPages(params = {}){
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.PLATFORM_CUSTOM_PAGES(), axiosOption);
    },
    saveNavbar(data) {
        const axiosOptions = Object.assign({}, { data },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_NAVBAR(), axiosOptions);
    }
};
export default InternalSettingsService;