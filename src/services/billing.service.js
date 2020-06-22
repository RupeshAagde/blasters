'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const BillingService = {
  getPlans(params) {
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
    return ApiService.get(URLS.FETCH_PLANS_LIST(), axiosOptions);
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
    return ApiService.get(URLS.FETCH_PLANS_COMPONENTS(), axiosOptions);
  }
};

export default BillingService;
