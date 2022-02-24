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
    exportInvoiceListing(params){
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
        return ApiService.get(URLS.EXPORT_INVOICE_LISTING(), axiosOptions);
    },
    chargeInvoice(payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(),{
            data: payload
        });
        return ApiService.post(URLS.CHARGE_INVOICE(), axiosOptions);
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
    voidInvoice(payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(),{
            data: payload
        });
        return ApiService.post(URLS.VOID_INVOICE(), axiosOptions);
    },

    getAvailablePlansDetailed(productSuiteIdOrSlug) {
        const axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(
            URLS.SUBSCRIPTION_GET_AVAILABLE_PLANS_DETAILED(),
            axiosOption
        );
    },
    getSubscriberDetails(options) {
        const { unique_id,product_suite,type } = options.params
        const company_id = unique_id
        const axiosOption = Object.assign(
            {},
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_CUSTOMER_DETAILS(company_id), axiosOption);
    },
    creditAdjustment(params,payload) {
        const { unique_id,product_suite,type } = params
        const company_id = unique_id
        const axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(),
            {
                data: payload,
                params:{
                    product_suite,
                    type
                }
            }
        );
        return ApiService.post(URLS.CREDIT_ADJUSTMENT(company_id), axiosOption);
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
    getCreditTransactions(options) {
        const { unique_id,product_suite,type } = options.params
        const company_id = unique_id
        const axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(),
            {params:options.params}
        );
        return ApiService.get(URLS.GET_CREDIT_TRANSACTIONS(company_id), axiosOption);
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
    activatePlan(company_id,payload){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data: payload
        });
        return ApiService.post(URLS.SUBSCRIPTION_ACTIVATE(company_id), axiosOptions);
    },
    cancelSubscription(company_id, payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(),{
            data: payload
        });
        return ApiService.post(URLS.SUBSCRIPTION_CANCEL(company_id), axiosOptions);
    },

    getCouponList(params) {
        const axiosOptions = Object.assign({},
            { params: params },
            getCommonHeaderOptions());
        return ApiService.get(URLS.SUBSCRIPTION_COUPON(), axiosOptions);
    },
    
    getApplyCoupon(params) {
        const axiosOptions = Object.assign({},
            { params: params },
             getCommonHeaderOptions());
        return ApiService.get(URLS.SUBSCRIPTION_VALIDITY_COUPON(), axiosOptions);
    },

    getCouponId(id) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.SUBSCRIPTION_COUPON(id), axiosOptions);
    },
    

    postCouponList(payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(),
        { data: payload }
        );
        return ApiService.post(URLS.SUBSCRIPTION_COUPON(), axiosOptions);
    },
    putCouponList(payload,id) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(),
        { data: payload }
        );
        return ApiService.put(URLS.SUBSCRIPTION_COUPON(id), axiosOptions);
    },

    getPlans(params) {
        const axiosOptions = Object.assign({}, 
            { params: params },
            getCommonHeaderOptions());
        return ApiService.get(URLS.FETCH_PLANS_LIST(), axiosOptions);
    },
    getSubscribers(params) {
        const axiosOptions = Object.assign({},
            { params: params },
            getCommonHeaderOptions());
        return ApiService.get(URLS.SUBSCRIBER_LIST(), axiosOptions);
    },
    getUniqueCoupon(code) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.SUBSCRIPTION_COUPON_UNIQUE(code), axiosOptions);
    },



};

export default BillingService;
