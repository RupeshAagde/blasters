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
        return ApiService.get(URLS.FETCH_PLANS_LIST(planId), axiosOptions);
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

    getComponentPrices(params) {
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
        return ApiService.get(URLS.FETCH_COMPONENT_PRICES(), axiosOptions);
    },

    getComponentWithPrices(params) {
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
        return ApiService.get(URLS.FETCH_COMPONENT_WITH_PRICES(), axiosOptions);
    },

    getPlanComponents(params) {
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
        return ApiService.get(URLS.FETCH_PLAN_COMPONENTS(), axiosOptions);
    }
};

export default BillingService;
