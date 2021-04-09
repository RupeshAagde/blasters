'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object } from 'window-or-global';
import CompanyService from './company-admin.service';

const CatalogService = {
    fetchChoices(params) {
        const axiosOption = Object.assign(
            {
                params: params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_CHOICE_TYPES(), axiosOption);
    },
    fetchAttributes(params) {
        const axiosOption = Object.assign(
            {
                params: params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_ATTRIBUTE(), axiosOption);
    },
    fetchVariants(params) {
        const axiosOption = Object.assign(
            {
                params: params
            },
            getCommonHeaderOptions()
        );

        return ApiService.get(URLS.FETCH_VARIANT(), axiosOption);
    },
    saveVariant(body) {
        const axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );

        return ApiService.post(URLS.FETCH_VARIANT(), axiosOption);
    },
    fetchDepartment(params) {
        const axiosOption = Object.assign(
            {
                params: params
            },
            getCommonHeaderOptions()
        );

        return ApiService.get(URLS.FETCH_DEPARTMENT(), axiosOption);
    },
    saveDepartment(body, uid) {
        const axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        if(uid){
            return ApiService.put(URLS.FETCH_DEPARTMENT(uid), axiosOption);    
        }
        return ApiService.post(URLS.FETCH_DEPARTMENT(), axiosOption);
    }
};
export default CatalogService;
