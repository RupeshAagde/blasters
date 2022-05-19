'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const ExtensionPageService = {
    getAvailableSections(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_AVAILABLE_SECTIONS(), axiosOptions);
    }
}

export default ExtensionPageService;