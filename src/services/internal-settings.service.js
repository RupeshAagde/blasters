'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const InternalSettingsService = {
    getBasicSettings() {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_BASIC_DETAILS(), axiosOptions);
    },
    updateBasicSettings(data) {
        const axiosOptions = Object.assign({}, { data },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_BASIC_DETAILS_UPDATE(), axiosOptions);
    },
    getNavbar() {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_NAVBAR(), axiosOptions);
    },

    getDefaultNavbar() {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_DEFAULT_NAVBAR(), axiosOptions);
    },
    getCustomPages(params = {}){
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.PLATFORM_CUSTOM_PAGES(), axiosOption);
    },
    previewCustomPage(slug){
        let axiosOption = Object.assign(
            {
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.PLATFORM_EDIT_CUSTOM_PAGES(slug), axiosOption);
    },
    editCustomPage(id,data){
        let axiosOption = Object.assign(
            {
            }, {data},
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_EDIT_CUSTOM_PAGES(id), axiosOption);
    },
    editPublished(slug,data){
        let axiosOption = Object.assign(
            {
            }, {data},
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_PUBLISHED(slug), axiosOption);
    },
    
    createCustomPage(data){
        const axiosOptions = Object.assign({}, { data },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.PLATFORM_CUSTOM_PAGES(), axiosOptions);
    }
    ,
    getEditPage(slug){
        const axiosOptions = Object.assign({}, { },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_EDIT_CUSTOM_PAGES(slug), axiosOptions);
    },
    saveNavbar(data) {
        const axiosOptions = Object.assign({}, { data },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_NAVBAR(), axiosOptions);
    },
    getHomePage(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_HOME_PAGE(), axiosOptions);
    },
    setHomePage(data){
        const axiosOptions = Object.assign({}, { data },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_HOME_PAGE(), axiosOptions);
    },
    getFooterList(params = {}) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.PLATFORM_CUSTOM_FOOTER(), axiosOption);
    },
    saveFooter(data, id){
        const axiosOptions = Object.assign({}, { data },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_CUSTOM_FOOTER(id), axiosOptions);
    },
    createFooter(data){
        const axiosOptions = Object.assign({}, { data },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.PLATFORM_CUSTOM_FOOTER(), axiosOptions);
    },
    getCustomTags(params={}){
        let axiosOptions = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.PLATFORM_CUSTOM_TAGS(), axiosOptions);

    },
    postCustomTags(data){
        const axiosOptions = Object.assign({},{data}, getCommonHeaderOptions());
        return ApiService.post(URLS.PLATFORM_CUSTOM_TAGS(), axiosOptions);

    },
    putCustomTag(id,data){
        const axiosOptions = Object.assign({},{data}, getCommonHeaderOptions());
        return ApiService.put(URLS.PLATFORM_CUSTOM_TAGS(id), axiosOptions);
    },
    getUpdateTags(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_CUSTOM_TAGS(id), axiosOptions);
    },
    deleteTag(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.del(URLS.PLATFORM_CUSTOM_TAGS(id), axiosOptions);
    },
    getPricingBanner(){
        let axiosOption = Object.assign({},getCommonHeaderOptions());
        return ApiService.get(URLS.PLATFORM_PRICING_BANNER(), axiosOption);
    },
    savePricingBanner(data){
        const axiosOptions = Object.assign({}, { data },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.PLATFORM_PRICING_BANNER(), axiosOptions);
    }
    
};
export default InternalSettingsService;