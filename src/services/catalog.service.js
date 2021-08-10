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
        if (uid) {
            return ApiService.put(URLS.FETCH_DEPARTMENT(uid), axiosOption);
        }
        return ApiService.post(URLS.FETCH_DEPARTMENT(), axiosOption);
    },
    fetchVerificationCompanyListing(params) {
        const { companyId } = params;
        const axiosOption = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_VERIFICATION_COMPANY_LIST(companyId), axiosOption);
    },
    fetchVariantProductListing(data) {
        const { companyId, ...params } = data;
        const axiosOption = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_VERIFICATION_PRODUCT_LIST(companyId), axiosOption);
    },
    fetchVerificationProductDetails(data) {
        const { companyId, itemId, ...params } = data;
        const axiosOption = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_VERIFICATION_PRODUCT_DATA({ companyId, itemId }), axiosOption);
    },
    saveVerifiedProducts(data, edit=true) {
        const { companyId, itemId, body, ...params } = data;
        console.log("params => ", params);
        const axiosOption = Object.assign(
            { params },
            { data: body },
            getCommonHeaderOptions()
        );

        if(!edit){
            return ApiService.post(URLS.FETCH_VERIFICATION_PRODUCT_LIST(companyId), axiosOption);    
        }
        return ApiService.put(URLS.FETCH_VERIFICATION_PRODUCT_DATA({ companyId, itemId }), axiosOption);
    },
};
export default CatalogService;
