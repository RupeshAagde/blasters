'use strict';

import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import URLS from './domain.service';

const RMAService = {
    getSalesChannel(params) {
        const axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_RMA_SALES_CHANNEL(), axiosOption);
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
    getDepartments() {
        return ApiService.get(URLS.GET_DEPARTMENTS());
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
