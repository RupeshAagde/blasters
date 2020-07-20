'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object, console } from 'window-or-global';

const InternalSettingsService = {
    getBasicSettings() {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_BASIC_DETAILS(), axiosOptions);
    },
    updateBasicSettings(data) {
        const axiosOptions = Object.assign(
            {},
            { data },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_BASIC_DETAILS(), axiosOptions);
    }
};
export default InternalSettingsService;
