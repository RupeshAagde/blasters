'use strict';

import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import URLS from './domain.service';

const RMAService = {
    defaultPagination: {
        page_no: 1,
        page_size: 10,
    },
    getSalesChannels(params = {}) {
        const axiosOption = Object.assign(
            {
                params: {
                    ...this.defaultPagination,
                    ...params
                }
            },
            getCommonHeaderOptions()
        )
        return ApiService.get(URLS.GET_RMA_SALES_CHANNEL(), axiosOption);
    },
    getRulesList(params = {}) {
        const axiosOption = Object.assign(
            {
                params: {
                    ...this.defaultPagination,
                    ...params
                }
            },
            getCommonHeaderOptions()
        )
        return ApiService.get(URLS.RMA_RULES(), axiosOption);
    },
    deleteRule(data = {}){
        const axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(),
            {
                data: data
            }
        )
        return ApiService.post(URLS.RMA_RULES(), axiosOption);
    }
}

export default RMAService;