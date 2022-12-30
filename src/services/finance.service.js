import ApiService from './api.service';
import URLS from './domain.service';
import ADMIN_URLS from './admin-url.service';
import {getCompInfo, getCommonHeaderOptions } from '@/services/utils.service';

const FinanceService = {
   getFileType(data) {
      let axiosOption = Object.assign({}, { data });
      return ApiService.post(URLS.GET_FILE_TYPE(), axiosOption);
   },
   getDownloadFormat(data) {
      let axiosOption = Object.assign({}, { data });
      return ApiService.post(URLS.GET_DOWNLOAD_FORMAT(), axiosOption);
   },
   getPreSignedUrl(data) {
    let axiosOption = Object.assign({}, { data });
    return ApiService.post(URLS.GET_PRESIGNED_URL(), axiosOption);
 },

    callPresignedUrl(url,data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.CALL_PRESIGNED_URL(url), axiosOption);
    },

    validateFile(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_UPLOAD_URL(), axiosOption);
     },

    //  v1.0/upload-report

};

export default FinanceService;