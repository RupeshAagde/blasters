'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object, console, URL } from 'window-or-global';

const CompanyService = {
    fetchMetrics(params = {}) {
        let axiosOption = Object.assign({
            params
        });
        return ApiService.get(URLS.FETCH_METRICS(), axiosOption);
    },
    searchUser(params) {
        const axiosOption = Object.assign(
            {
                params: params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.SEARCH_DRI(), axiosOption);
    },
    createDri(body) {
        const axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );

        return ApiService.post(URLS.FETCH_DRI(), axiosOption);
    },
    removeDri(body) {
        const axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );

        return ApiService.del(URLS.FETCH_DRI(), axiosOption);
    },
    editDri(params) {
        const axiosOption = Object.assign(
            { params: params },
            getCommonHeaderOptions()
        );

        return ApiService.get(URLS.FETCH_DRI(), axiosOption);
    },
    fetchDesignation(params) {
        const axiosOption = Object.assign(
            { params: params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_CHOICE_TYPES(), axiosOption);
    },
    searchDri(params) {
        const axiosOption = Object.assign(
            { params: params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.SEARCH_DRI(), axiosOption);
    },
    fetchDri(params) {
        const axiosOption = Object.assign(
            { params: params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_DRI(), axiosOption);
    },

    fetchApplication(uid, params) {
        const axiosOption = Object.assign(
            { params: params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_APPLICATIONS(uid), axiosOption);
    },

    adminActionApplication(uid, appId, params) {
        const axiosOption = Object.assign(
            { data: params },
            getCommonHeaderOptions()
        );
        return ApiService.put(
            URLS.ACTION_APPLICATIONS(uid, appId),
            axiosOption
        );
    },

    getCompanyList(params) {
        const axiosOptions = Object.assign(
            {},
            { params: params },
            // getCommonHeaderOptions(),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-currency-code': 'INR'
                }
            }
        );
        return ApiService.get(URLS.GET_COMPANY_LIST(), axiosOptions);
    },

    adminActionCompany(body) {
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.GET_COMPANY_LIST(), axiosOption);
    },

    adminActionBrand(body) {
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.BRAND_ADMIN_ACTION(), axiosOption);
    },
    adminActionStore(body) {
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.STORE_ADMIN_ACTION(), axiosOption);
    },
    fetchBrands(params = {}) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_COMPANY_BRANDS(), axiosOption);
    },
    fetchChoiceType(params = {}) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_CHOICE_TYPES(), axiosOption);
    },
    //Fetch Company Stores
    fetchStores(params = {}) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.COMPANY_STORES(), axiosOption);
    },
    // Fetch Company Profile
    fetchCompanyProfile(params) {
        let axiosOption = Object.assign({ params });
        return ApiService.get(URLS.COMPANY_PROFILE(), axiosOption);
    }
};
export default CompanyService;
