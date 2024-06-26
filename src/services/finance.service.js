import ApiService from './api.service';
import URLS from './domain.service';
import ADMIN_URLS from './admin-url.service';
import { getCommonHeaderOptions } from '@/services/utils.service';

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
    getLocationID(data) {
        //let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(
            ADMIN_URLS.GET_LOCATION_ID(data),
            getCommonHeaderOptions()
        );
    },
    getLocationIDAdmin(data) {
        let header = getCommonHeaderOptions();
        //header.headers['Authorization'] = `31fe389e-6b41-4bcf-8f7f-5ecbb6130fb5`;
        let axiosOption = Object.assign({}, header);
        return ApiService.get(URLS.GET_LOCATION_ID(data), axiosOption);
    },
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

    uploadToS3(url, data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(url, axiosOption, {
            withCredentials: true
        });
    },

    uploadUrl(data) {
        let axiosOption = Object.assign({ data });
        return ApiService.post(URLS.GET_UPLOAD_URL(), axiosOption);
    },
    callPresignedUrl(url, data) {
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
    },

    //Invoice 

    getInvoiceList(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_INVOICE_LIST(), axiosOption);
    },
    getInvoiceType(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_INVOICE_TYPE(), axiosOption);
    },
    getPaymentStatus(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_INVOICE_PAYMENT(), axiosOption);
    },
    getDownloadUrlList(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_INVOICE_DOWNLOAD_URLS(), axiosOption);
    },
    invoiceVoid(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.VOID_FIN_INVOICE(), axiosOption);
    },
    getCompanyList(params) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { params: params })
        return ApiService.get(URLS.GET_COMPANY_LIST_FIN(), axiosOption);
    },
    getBrandList(id, query) {
        let axiosOption = Object.assign({}, { });
        return ApiService.get(URLS.GET_BRAND_LIST_FIN(id, query), axiosOption);
    },
    getAffiliateFin(data) {
        let axiosOption = Object.assign({}, {data});
        return ApiService.post(URLS.GET_AFFILIATE_LIST_FIN(), axiosOption);
    },
    getDataFin(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_DATA_FIN(), axiosOption);
    },
    getRuleData(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_RULE_DATA(), axiosOption);
    },
    generateRules(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GENERATE_RULE(), axiosOption);
    },
    editRules(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.put(URLS.GENERATE_RULE(), axiosOption);
    },
    getRulesList(data){
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_DATA_FIN(), axiosOption);
    },
    deleteRule(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.put(URLS.GENERATE_RULE(), axiosOption);
    },
    getGlobalAffiliate(params) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { params: params })
        return ApiService.get(URLS.FILTERS_V2(), axiosOption);
    },
    
    getReasons(data){
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_REASONS_LIST(), axiosOption);
    },
    invoiceExtendDate(data){
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.EXTEND_DATE_INVOICE(), axiosOption);
    },
    //Payments
    updatePaymentInfo(params) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
          data: params
        });
        return ApiService.post(URLS.CREDITLINE_PAYMENTS(), axiosOptions);
    },
};

export default FinanceService;
