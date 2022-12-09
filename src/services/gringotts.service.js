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
}

export default PaymentServices;