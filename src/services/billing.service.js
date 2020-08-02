'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const BillingService = {
    getPlans(params, planId = '') {
        const axiosOptions = Object.assign(
            {},
            { params: params },
            // getCommonHeaderOptions()
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-currency-code': 'INR'
                }
            }
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
            // getCommonHeaderOptions()
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-currency-code': 'INR'
                }
            }
        );
        return ApiService.get(
            URLS.FETCH_SUBSCRIPTION_COMPONENTS(),
            axiosOptions
        );
    },

    createPlan(payload) {
        const axiosOptions = Object.assign(
            {},
            // getCommonHeaderOptions()
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-currency-code': 'INR'
                },
                data: payload
            }
        );
        return ApiService.post(URLS.FETCH_SINGLE_PLAN(''), axiosOptions);
    },

    updatePlan(payload, planId) {
        const axiosOptions = Object.assign(
            {},
            // getCommonHeaderOptions()
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-currency-code': 'INR'
                },
                data: payload
            }
        );
        return ApiService.put(URLS.FETCH_PLANS_LIST(planId), axiosOptions);
    },

    getDaytraderComponents() {
        const axiosOptions = Object.assign(
            {},
            // getCommonHeaderOptions()
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-currency-code': 'INR'
                }
            }
        );
        return ApiService.get(URLS.FETCH_DAYTRADER_COMPONENT(), axiosOptions);
    },

    getDaytraderConfig(payload) {
        const axiosOptions = Object.assign(
            {},
            // getCommonHeaderOptions()
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-currency-code': 'INR'
                },
                data: payload
            }
        );
        return ApiService.post(URLS.FETCH_DAYTRADER_CONFIG(), axiosOptions);
    }
};

export default BillingService;
