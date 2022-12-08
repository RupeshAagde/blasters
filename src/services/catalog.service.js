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
    fetchVariants(params, uid) {
        const axiosOption = Object.assign(
            {
                params: !uid ? params : {}
            },
            getCommonHeaderOptions()
        );

        if (uid) {
            return ApiService.get(URLS.FETCH_VARIANT(uid), axiosOption);
        }
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
    updateVariant(body) {
        const axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.FETCH_VARIANT(body.uid), axiosOption);
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
    
    //bulk feature
    bulkRequest(job_type, data) {
        let axiosOption = Object.assign(
            {},
            {
                data
            },
            getCommonHeaderOptions()
        );
        return ApiService.post(`${URLS.BULK_REQUEST(job_type)}`, axiosOption);
    },
    bulkHistory(job_type, params) {
        let axiosOption = Object.assign(
            {},
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            `${URLS.BULK_HISTORY_REQUEST(job_type)}`,
            axiosOption
        );
    },
    //download sample product template
    sampleBulkTemplateLink(job_type, file_type = 'excel', filter) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions()
        );
        let url = `${URLS.DOWNLOAD_SAMPLE_BULK_TEMPLATE(job_type)}?&file_type=${file_type}`;
        let urlWithFilter = filter ? `${url}&filter=${filter}` : url;
        return ApiService.get(
            urlWithFilter, axiosOption, { 'responseType': 'blob' }
        );
    },
    fetchTemplateSchema(job_type, params = {}, filter) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        let url = filter ? `${URLS.BULK_TEMPLATE_VALIDATION(job_type)}?filter=${filter}` : URLS.BULK_TEMPLATE_VALIDATION(job_type);
        return ApiService.get(
            url,
            axiosOption
        );
    },
    bulkSend(data, job_id, job_type) {
        let axiosOption = Object.assign(
            {},
            {
                data
            },
            getCommonHeaderOptions()
        );
        return ApiService.post(`${URLS.BULK_SEND(job_type)}/${job_id}`, axiosOption);
    },
};
export default CatalogService;
