'use strict';

import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import URLS from './domain.service';

const RMAService = {
    getSalesChannel(params) {
        const axiosOption = Object.assign(
            {
                params: params
            },
            getCommonHeaderOptions()
        )
        return ApiService.get(URLS.GET_RMA_SALES_CHANNEL(), axiosOption);
    }
}

export default RMAService;