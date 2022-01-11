'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object } from 'window-or-global';

const CompanyService = {
    fetchMetrics(params = {}) {
        let axiosOption = Object.assign({
            params
        });
        return ApiService.get(URLS.FETCH_METRICS(params), axiosOption);
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

        return ApiService.post(URLS.FETCH_DRI(body), axiosOption);
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
            { data: params },
            getCommonHeaderOptions()
        );

        return ApiService.put(URLS.FETCH_ONE_DRI(params), axiosOption);
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
        return ApiService.get(URLS.FETCH_DRI(params), axiosOption);
    },
    fetchOneDri(params) {
        const axiosOption = Object.assign(
            {},
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.FETCH_ONE_DRI(params), axiosOption);
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

    getDeploymentMappings(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(`${URLS.GET_DEPLOYMENT_MAPPING()}`, axiosOptions);
    },

    getDeploymentList() {
        const axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(),
        );
        return ApiService.get(URLS.GET_DEPLOYMENT_LIST(), axiosOptions);
    },

    createDeploymentMapping(body) {
        const axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.CREATE_NEW_DEPLOYMENT_MAPPING(), axiosOption);
    },

    deleteDeploymentMappingById(id) {
        const axiosOption = Object.assign(
            {},
            getCommonHeaderOptions()
        );
        return ApiService.del(URLS.DELETE_DEPLOYMENT_MAPPING_BY_ID(id), axiosOption);
    },
    
    adminActionCompany(body) {
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.VERIFY_COMPANY(body), axiosOption);
    },

    adminActionBrand(body) {
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.BRAND_ADMIN_ACTION(body), axiosOption);
    },
    adminActionStore(body) {
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.STORE_ADMIN_ACTION(body), axiosOption);
    },
    fetchBrands(params = {}) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_COMPANY_BRANDS(params), axiosOption);
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
        return ApiService.get(URLS.COMPANY_STORES(params), axiosOption);
    },
    // Fetch Company Profile
    fetchCompanyProfile(params) {
        let axiosOption = Object.assign({ params });
        return ApiService.get(URLS.COMPANY_PROFILE(params), axiosOption);
    },
    // List product attributes master
    fetchAttributes(params) {
        let axiosOption = Object.assign({ params });
        return ApiService.get(URLS.ATTRIBUTES_MASTER(), axiosOption);
    },

    fetchAttribute(slug) {
        return ApiService.get(URLS.ATTRIBUTES_MASTER(slug), {});
    },
    createAttribute(data) {
        let axiosOption = Object.assign({}, { data }, getCommonHeaderOptions());
        return ApiService.post(URLS.ATTRIBUTES_MASTER(), axiosOption);
    },
    updateAttribute(data) {
        let axiosOption = Object.assign({}, { data }, getCommonHeaderOptions());
        return ApiService.put(URLS.ATTRIBUTES_MASTER(), axiosOption);
    },
    fetchProductDetails(data) {
        const { companyId, itemId, ...params } = data;
        let axiosOption = Object.assign({ params });
        return ApiService.get(URLS.PRODUCT({ companyId, itemId }), axiosOption);
    },
    fetchProductTemplates(params) {
        let axiosOption = Object.assign({ params });
        return ApiService.get(URLS.PRODUCT_TEMPLATES(), axiosOption);
    },
    fetchProductTemplate(slug) {
        return ApiService.get(URLS.PRODUCT_TEMPLATES(slug), {});
    },
    createProductTemplate(slug, data) {
        let axiosOption = Object.assign({}, { data }, getCommonHeaderOptions());
        return ApiService.post(URLS.PRODUCT_TEMPLATES(slug), axiosOption);
    },
    updateProductTemplate(slug, data) {
        let axiosOption = Object.assign({}, { data }, getCommonHeaderOptions());
        return ApiService.put(URLS.PRODUCT_TEMPLATES(slug), axiosOption);
    },
    fetchDepartments(params) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.DEPARTMENT(), axiosOption);
    },
    fetchUnits() {
        return ApiService.get(URLS.UNITS(), {});
    },
    fetchCategories(params) {
        let axiosOption = Object.assign({ params });
        return ApiService.get(URLS.CATEGORY(), axiosOption);
    },
    fetchGroups(params) {
        let axiosOption = Object.assign({ params });
        return ApiService.get(URLS.ATTRIBUTE_GROUPS(), axiosOption);
    },
    fetchGroupDetails(slug, params) {
        let axiosOption = Object.assign({ params });
        return ApiService.get(URLS.ATTRIBUTE_GROUPS(slug), axiosOption);
    },
    createAttributeGroup(data) {
        let axiosOption = Object.assign({ data });
        return ApiService.post(URLS.ATTRIBUTE_GROUPS(), axiosOption);
    },
    updateAttributeGroup(data) {
        let axiosOption = Object.assign({ data });
        return ApiService.put(URLS.ATTRIBUTE_GROUPS(), axiosOption);
    },
    fetchShuffleAttributeGroups(entity) {
        return ApiService.get(URLS.ATTRIBUTE_GROUPS_SHUFFLE(entity), {});
    },
    shuffleAttributeGroups(entity, data) {
        let axiosOption = Object.assign({ data });
        return ApiService.post(
            URLS.ATTRIBUTE_GROUPS_SHUFFLE(entity),
            axiosOption
        );
    },
    fetchShuffleAttributes(entity) {
        return ApiService.get(URLS.ATTRIBUTE_SHUFFLE(entity), {});
    },
    shuffleAttribute(entity, data) {
        let axiosOption = Object.assign({ data });
        return ApiService.post(URLS.ATTRIBUTE_SHUFFLE(entity), axiosOption);
    },
    productTemplateDownload(slug) {
        return ApiService.get(URLS.PRODUCT_TEMPLATE_DOWNLOAD(slug), {}, { 'responseType': 'blob' });
    },
    // Categories
    fetchCategory_v2(params) {
        const { uid, ...rest } = params;
        let axiosOption = Object.assign(
            {
                params: rest
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.CATEGORY_v2(uid), axiosOption);
    },
    updateCategory_v2(params) {
        const { id, ...rest } = params;
        let axiosOption = Object.assign(
            {
                data: rest
            },
            getCommonHeaderOptions()
        );
        if (id) {
            return ApiService.put(URLS.CATEGORY_v2(id), axiosOption);
        }
        return ApiService.post(URLS.CATEGORY_v2(), axiosOption);
    },
    // Fetch Company List
    fetchCompanyList() {
        let headers = {
            'Content-Type': 'application/json'
        };
        let axiosOption = Object.assign(
            {},
            {
                headers
            }
        );
        return ApiService.get(URLS.FETCH_COMPANY_LIST(), axiosOption);
    },
    fetchTemplateSchema({companyId, slug, ...params}) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            URLS.PRODUCT_TEMPLATE_VALIDATION({companyId, slug}),
            axiosOption
        );
    },
    getSizeGuide({companyId, ...params}) {
        let axiosOption = Object.assign(
            {},
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.SIZE_GUIDE_URL(companyId), axiosOption);
    }

};
export default CompanyService;
