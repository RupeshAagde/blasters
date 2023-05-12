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
        console.log(axiosOption);
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
    getCompanyList(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_COMPANY_LIST_FIN(), axiosOption);
    },
    getDataFin(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_DATA_FIN(), axiosOption);
    },
    getRuleData(data) {
        let axiosOption = Object.assign({}, { data });
        return ApiService.post(URLS.GET_RULE_DATA(), axiosOption);
    },
    
};

export default FinanceService;
