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

    getInvoiceListing(params){
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
        return ApiService.get(URLS.FETCH_INVOICE_LISTING(), axiosOptions);
    },
    getInvoiceDetail(InvoiceId) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.FETCH_INVOICE_DETAILS(InvoiceId), axiosOptions);
    },
    updateOfflinePayment(InvoiceId,payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(),{
            data: payload
        });
        return ApiService.put(URLS.UPDATE_OFFLINE_PAYMENT(InvoiceId), axiosOptions);
    },

    getAvailablePlansDetailed(productSuiteIdOrSlug) {
        const axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(
            URLS.SUBSCRIPTION_GET_AVAILABLE_PLANS_DETAILED(),
            axiosOption
        );
    },
    getCurrentActivePlan(options) {
        const { unique_id,product_suite,type } = options.params
        const company_id = unique_id
        const axiosOption = Object.assign(
            {},
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.SUBSCRIPTION_GET_ACTIVE_PLAN(company_id), axiosOption);
    },
    fetchCompanyMaxApplicationLimit({company_id}) {
        const axiosOption = Object.assign({}, getCommonHeaderOptions() );
        return ApiService.get(
            URLS.SUBSCRIPTION_MAX_APPLICATION_LIMIT(company_id),
            axiosOption
        );
    },
    getPlanDetailsById(plan_id) {
        const axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(
            URLS.SUBSCRIPTION_GET_PLAN_DETAILS_BY_ID(plan_id),
            axiosOption
        );
    },
    updateSubscriptionById(company_id,subscription_id,payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(),{
            data: payload
        });
        return ApiService.put(URLS.SUBSCRIPTION_UPDATE_BY_ID(company_id,subscription_id), axiosOptions);
    },
};

export default BillingService;
