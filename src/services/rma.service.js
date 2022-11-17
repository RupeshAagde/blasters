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
        return ApiService.put(URLS.RMA_RULES('/' + data.id), axiosOption);
    },
    getOptedSalesChannelList(params) {
        const axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_OPTED_RMA_SALES_CHANNEL(), axiosOption);
    },
    getOrderingChannel(query_param) {
        const axiosOption = Object.assign(
            { data: {} },
            { params: query_param },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_RMA_ORDERING_CHANNEL(), axiosOption);
    },
    getPlatformCounts() {
        return ApiService.get(URLS.GET_PLATFORM_COUNTS());
    },
    getDepartments(params) {
        const axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_DEPARTMENTS(), axiosOption);
    },
    getCategories(params) {
        const axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_CATEGORIES(), axiosOption);
    },
    getReasons(params) {
        const axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_REASONS(), axiosOption);
    },
    getQuestions(params) {
        const axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_QUESTIONS(), axiosOption);
    }
};

export default RMAService;