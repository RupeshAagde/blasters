'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const BillingService = {
    getPlans(params, planId = '') {
        const axiosOptions = Object.assign(
            {},
            { params: params },
            getCommonHeaderOptions()
        );
        if (planId) {
            return ApiService.get(URLS.FETCH_SINGLE_PLAN(planId), axiosOptions);
        }
        return ApiService.get(URLS.FETCH_PLANS_LIST(), axiosOptions);
    },

    getComponents(params) {
        const axiosOptions = Object.assign(
            {},
            { params: params },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            URLS.FETCH_SUBSCRIPTION_COMPONENTS(),
            axiosOptions
        );
    },

    createPlan(payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data: payload
        });
        return ApiService.post(URLS.FETCH_SINGLE_PLAN(''), axiosOptions);
    },

    updatePlan(payload, planId) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data: payload
        });
        return ApiService.put(URLS.FETCH_PLANS_LIST(planId), axiosOptions);
    },

    getDaytraderComponents() {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {});
        return ApiService.get(URLS.FETCH_DAYTRADER_COMPONENT(), axiosOptions);
    },

    getDaytraderConfig(payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data: payload
        });
        return ApiService.post(URLS.FETCH_DAYTRADER_CONFIG(), axiosOptions);
    },
    getSubscriptionDaytraderRules(params, subcriptionId) {
        const axiosOptions = Object.assign(
            {},
            { params: params },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            URLS.SUBSCRIPTION_DAYTRADER_RULES(subcriptionId),
            axiosOptions
        );
    },
    addSubscriptionDaytraderRule(subcriptionId, payload) {
        const axiosOptions = Object.assign(
            {},
            { data: payload },
            getCommonHeaderOptions()
        );
        return ApiService.post(
            URLS.SUBSCRIPTION_DAYTRADER_RULES(subcriptionId),
            axiosOptions
        );
    },
    getDaytraderFilters(payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data: payload
        });
        return ApiService.post(URLS.FETCH_DAYTRADER_FILTERS(), axiosOptions);
    },
    getCurrentPlanDetails(params) {
        const axiosOptions = Object.assign(
            {},
            { params: params },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            URLS.CURRENT_SUBSCRIPTION_DETAILS(),
            axiosOptions
        );
    },
    getPlanDetail(planId) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.PLAN_DETAILS(planId), axiosOptions);
    },
    getPlanPdf(planId) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.AGREEMENT_PDF(planId), axiosOptions);
    }
};

export default BillingService;
