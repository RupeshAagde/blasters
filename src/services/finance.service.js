import ApiService from './api.service';
import URLS from './domain.service';
import ADMIN_URLS from './admin-url.service';
import {getCompInfo, getCommonHeaderOptions } from '@/services/utils.service';

const FinanceService = {
  getReportType(data) {
    let axiosOption = Object.assign({}, { data });
    return ApiService.post(URLS.GET_REPORT_TYPE(), axiosOption);
  },
  getChannel(data) {
    let axiosOption = Object.assign({}, { data });
    return ApiService.post(URLS.GET_CHANNEL(), axiosOption);
  },
  getReport(data) {
    let axiosOption = Object.assign({}, { data });
    return ApiService.post(URLS.GET_REPORT(), axiosOption);
  },
  generateReport(data) {
    let axiosOption = Object.assign({}, { data });
    return ApiService.post(URLS.GENERATE_REPORT(), axiosOption);
  },
  getLocationID(data){
    //let axiosOption = Object.assign({}, getCommonHeaderOptions());
    return ApiService.get(ADMIN_URLS.GET_LOCATION_ID(data),getCommonHeaderOptions());
  },
  getLocationIDAdmin(data){
    let header = getCommonHeaderOptions();
    //header.headers['Authorization'] = `31fe389e-6b41-4bcf-8f7f-5ecbb6130fb5`;
    let axiosOption = Object.assign({},header);
    return ApiService.get(URLS.GET_LOCATION_ID(data), axiosOption);
  },
  /* getDisputeReason(data) {
    let axiosOption = Object.assign({}, { data });
    return ApiService.post(URLS.DISPUTE_REASON(), axiosOption);
  } */

};
//token: '86e64a772be2544b09de0e73989ab687'
export default FinanceService;