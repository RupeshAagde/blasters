import ApiService from './api.service';
import URLS from './domain.service';
import ADMIN_URLS from './admin-url.service';
import {getCompInfo, getCommonHeaderOptions } from '@/services/utils.service';

const FinanceService = {
   getFileType(data) {
    console.log(data);
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

   uploadToS3(url,data) {
        let axiosOption = Object.assign({}, { data });
        console.log("axiosoptn");
        console.log(axiosOption);

        return ApiService.post(url, axiosOption);
    },

    uploadUrl(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_UPLOAD_URL(), axiosOption);
     },

};

export default FinanceService;