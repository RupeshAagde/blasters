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

    fetchDepartments() {
        return ApiService.get(URLS.DEPARTMENT(), {});
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
        return `${URLS.PRODUCT_TEMPLATE_DOWNLOAD(
            slug
        )}?company_id=1&set=false&type=excel`;
    },
    // Categories
    fetchCategory_v2(params) {
        const { id, ...rest } = params;
        let axiosOption = Object.assign(
            {
                params: rest
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.CATEGORY_v2(id), axiosOption);
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
    }
};
export default CompanyService;
