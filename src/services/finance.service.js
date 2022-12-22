import ApiService from './api.service';
import URLS from './domain.service';
import ADMIN_URLS from './admin-url.service';
import {getCompInfo, getCommonHeaderOptions } from '@/services/utils.service';

const FinanceService = {
   getFileType(data) {
    console.log(data);
      let axiosOption = Object.assign({}, { data });
      return ApiService.post(URLS.GET_FILE_TYPE(), axiosOption);
   }
};

export default FinanceService;