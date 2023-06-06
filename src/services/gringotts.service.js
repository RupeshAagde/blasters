'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const PaymentServices = {
    getReviewDetails(params,status){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.FETCH_REVIEW_LIST(params,status) , axiosOptions);
    },
    postPgReview(params,payload){
        const axiosOptions = Object.assign(
            {},
            { data: payload },
            getCommonHeaderOptions()
        );
        return ApiService.post(
            URLS.PG_REVIEWED(params),
            axiosOptions
        );

    },
    getCOD(params){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.FETCH_COD_CONFIG(params),axiosOptions)
    },
    postCOD(params,payload){
        const axiosOptions = Object.assign(
            {},
            { data: payload },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.FETCH_COD_CONFIG(params),axiosOptions)
    },
    getPaymentGateways(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.FETCH_PAYMENT_GATEWAY_LIST(),axiosOptions)
    },
    getDeviceBusinessUnitList(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.FETCH_BUSINESS_UNIT_DEVICE_LIST(),axiosOptions)
    },
    // CRUD with aggregators
    getPaymentGatewayDetails(id, params){
        const axiosOptions = Object.assign({ params }, getCommonHeaderOptions());
        return ApiService.get(URLS.CRUD_PAYMENT_GATEWAY_DETAILS(id),axiosOptions)
    },
    updateAllPaymentGatewayConfig(id, payload){
        const axiosOptions = Object.assign(
            {},
            { data: payload },
            getCommonHeaderOptions()
        );
        return ApiService.patch(URLS.CRUD_PAYMENT_GATEWAY_DETAILS(id),axiosOptions)
    },
    saveCopiedConfigurationWithAggregator(payload){
        const axiosOptions = Object.assign(
            {},
            { data: payload },
            getCommonHeaderOptions()
        );
        return ApiService.patch(URLS.COPY_CONFIGURATION_AGGREGATOR(),axiosOptions)
    },
    // CRUD without aggregators
    getAllPaymentModes(params){
        const axiosOptions = Object.assign({ params }, getCommonHeaderOptions());
        return ApiService.get(URLS.CRUD_PAYMENT_MODE(),axiosOptions)
    },
    updateMOP(payload){
        const axiosOptions = Object.assign(
            {},
            { data: payload },
            getCommonHeaderOptions()
        );
        return ApiService.patch(URLS.CRUD_PAYMENT_MODE(),axiosOptions)
    },
    saveCopiedConfiguration(payload){
        const axiosOptions = Object.assign(
            {},
            { data: payload },
            getCommonHeaderOptions()
        );
        return ApiService.patch(URLS.COPY_CONFIGURATION(),axiosOptions)
    }
}

export default PaymentServices;