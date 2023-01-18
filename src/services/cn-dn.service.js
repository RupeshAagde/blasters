'use strict';

import ApiService from './api.service';
import URLS from './domain.service';
import { getCommonHeaderOptions } from './utils.service';

const CreditDebitNoteServices = {

  getListData(params){
    const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
      data: params
    });
    return ApiService.post(URLS.GET_LIST_DATA(), axiosOptions);
  },

  getEntity(params){
    const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
      data: params
    });
    return ApiService.post(URLS.GET_ENTITY(), axiosOptions);
  },

  getNoteDetails(params){
    const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
      data: params
    });
    return ApiService.post(URLS.GET_NOTE_DATA(), axiosOptions);
  },
    
    // return list of purposes for dropdown
    getPurpose(params) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
          data: params
        });
        return ApiService.post(URLS.GET_PURPOSE_DATA(), axiosOptions);
    },
    // create note
    saveNote(params) { 
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
          data: params
        });
        return ApiService.post(URLS.SAVE_NOTE(), axiosOptions);
    },
    getSellerDetails(params) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
          data: params
        });
        return ApiService.post(URLS.GET_USER_DETAILS(), axiosOptions);
    },
    // get service invoice details for gst fee invoice and gst service invoice
    getServiceInvoiceDetails(params) {
      const axiosOptions = Object.assign({},getCommonHeaderOptions(),
          { 
            data: params
          });

        return ApiService.post(URLS.GET_SERVICE_INVOICE_DETAILS(), axiosOptions);
    },
    // validate gst service invoice number for gst service 
    validateServiceInvoiceNumber(params) {
      const axiosOptions = Object.assign({},getCommonHeaderOptions(),
        {
          data: params
        });
      return ApiService.post(URLS.VALIDATE_INVOICE_NUMBER(),axiosOptions)
    },
    updateNoteStatus(params){
      const axiosOptions = Object.assign({},getCommonHeaderOptions(),
        { 
          data: params
        });

      return ApiService.post(URLS.UPDATE_NOTE_STATUS(), axiosOptions);
    },

    getGSTServiceInvoiceDetails(params) {
      const axiosOptions = Object.assign({},getCommonHeaderOptions(),
        { 
          data: params
        });
        return ApiService.post(URLS.GET_INVOICE_DETAILS(), axiosOptions);
    },
    downloadNote(params) {
      const axiosOptions = Object.assign({},getCommonHeaderOptions(),
        { 
          data: params
        });
      return ApiService.post(URLS.DOWNLOAD_NOTE(), axiosOptions);
    },
   
    //**** BULK API INTEGRATION *****//

    getBulkReportsListInfo(params) {
      const axiosOptions = Object.assign({},getCommonHeaderOptions(),
        { 
          data: params
        });
        return ApiService.post(URLS.REPORT_LIST_INFO(), axiosOptions);
    },

    getBulkReportsSampleFile(params) {

       let getCustomHeaderOptions = getCommonHeaderOptions();
      //  getCustomHeaderOptions.headers['x-user-data'] = JSON.stringify(userData);
      const axiosOptions = Object.assign({},getCustomHeaderOptions,
        { 
          data: params
        });
        return ApiService.post(URLS.UPLOAD_REPORT_SAMPLE_FILE(), axiosOptions);
    },

    UploadReportToPreProcess(params) {
      let getCustomHeaderOptions = getCommonHeaderOptions();
     // getCustomHeaderOptions.headers['x-user-data'] = JSON.stringify(userData);
      const axiosOptions = Object.assign({},getCustomHeaderOptions,
        { 
          data: params
        });
        return ApiService.post(URLS.UPLOAD_REPORT_TO_PREPROCESS(), axiosOptions);
    },

    getLatestReportStatus(params) {
    
      const axiosOptions = Object.assign({},getCommonHeaderOptions(),
        { 
          data: params
        });
        return ApiService.post(URLS.GET_LATEST_REPORT_STATUS(), axiosOptions);
    },

    getBulkReportsHistory(params) {
      let getCustomHeaderOptions = getCommonHeaderOptions();
      //getCustomHeaderOptions.headers['x-user-data'] = JSON.stringify(userData);

      const axiosOptions = Object.assign({},getCustomHeaderOptions,
        { 
          data: params
        });
        //return res
        return ApiService.post(URLS.UPLOAD_REPORT_FILE_HISTORY(), axiosOptions);
    },

    downloadErrorReport(params) {
      const axiosOptions = Object.assign({},getCommonHeaderOptions(),
        { 
          data: params
        });
      return ApiService.post(URLS.DOWNLOAD_ERROR_REPORT(), axiosOptions);
    },

    proceed(params) {
      const axiosOptions = Object.assign({},getCommonHeaderOptions(),
        { 
          data: params
        });
      return ApiService.post(URLS.PROCEED(), axiosOptions);
    }
};

export default CreditDebitNoteServices;
