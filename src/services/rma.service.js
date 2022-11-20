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
    getRulesList(data = {}) {
        const axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(),
            {
                data: {
                    ...this.defaultPagination,
                    ...data
                }
            }
        )
        return ApiService.post(URLS.RMA_RULES('', '/list'), axiosOption);
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
    },
    postRule(data) {
        const axiosOption = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.post(URLS.POST_RMA_RULE(), axiosOption);
    },
    toggleRulesType(data, id){
        const axiosOption = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.put(URLS.PUT_RMA_CONFIG_UPDATE('/' + id), axiosOption);
    }
};

export default RMAService;