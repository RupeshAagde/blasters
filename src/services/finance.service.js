import ApiService from './api.service';
import URLS from './domain.service';
import ADMIN_URLS from './admin-url.service';
import {getFormDataHeaders } from '@/services/utils.service';

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

   uploadToS3(url,data) {
        let axiosOption = Object.assign({}, { data });
        console.log("axiosoptn");
        console.log(axiosOption);
        return ApiService.post(url, axiosOption, {
         withCredentials: true,
        });

    },

    uploadUrl(data) {
        let axiosOption = Object.assign( { data } );
        return ApiService.post(URLS.GET_UPLOAD_URL(), axiosOption);
     },
   callPresignedUrl(url,data) {
      let axiosOption = Object.assign({}, { data });
      return ApiService.post(URLS.CALL_PRESIGNED_URL(url), axiosOption);
   },
   validateFile(data) {
      let axiosOption = Object.assign({}, { data });
      return ApiService.post(URLS.GET_UPLOAD_URL(), axiosOption);
   },
   getReportList(data) {
      let axiosOption = Object.assign({}, { data });
      return ApiService.post(URLS.GET_REPORT_LIST(), axiosOption); 
   }

};

export default FinanceService;