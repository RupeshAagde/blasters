'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object, console } from 'window-or-global';

const CompanyService = {
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
