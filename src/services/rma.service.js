'use strict';

import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import URLS from './domain.service';

const RMAService = {
    defaultPagination: {
        page_no: 1,
        page_size: 10,
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
        return ApiService.post(URLS.RMA_RULES_LIST(), axiosOption);
    },
    deleteRule(data = {}){
        const axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(),
            {
                data: data
            }
        )
        return ApiService.put(URLS.RMA_DELETE_RULE(data.id), axiosOption);
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
    editRule(id, data) {
        const axiosOption = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.put(URLS.PUT_RMA_RULE(id), axiosOption);
    },
    toggleRulesType(id, data){
        const axiosOption = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.put(URLS.PUT_RMA_CONFIG_UPDATE(id), axiosOption);
    }
};

export default RMAService;
