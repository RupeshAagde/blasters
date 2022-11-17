'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object } from 'window-or-global';

const PlatformConfigService = {
    fetchPlatformConfig(){
        const axiosOption = Object.assign(
            getCommonHeaderOptions(),

        );
        return ApiService.get(URLS.PLATFORM_CONFIG(), axiosOption);
    },

    editPlatformConfig(body) {
        const axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );

        return ApiService.post(URLS.PLATFORM_CONFIG(), axiosOption);
    },
};

export default  PlatformConfigService ;
