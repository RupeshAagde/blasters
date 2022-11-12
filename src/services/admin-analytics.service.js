import ApiService from "./api.service";
import ADMIN_URLS from "./admin-url.service";
import {getCommonHeaderOptions} from "./utils.service.js";
import {ANALYTICS_PAGES} from "@/components/generic-graphs/data/constants";
import screenSize from "./screen-size/analytics-screen-size";
import {SALES_CHANNEL_TYPE} from "@/store/modules/admin-analytics.module";
import {getLayoutName} from "@/helper/analytics-helper";

function getDataForLayouts(layoutName, data) {
    switch (layoutName) {
        case ANALYTICS_PAGES.DASHBOARD:
            return {
                dlayout: {
                    panels: data
                }
            }
        case ANALYTICS_PAGES.REPORTS:
            return {
                dlayout: {
                    panels: data
                }
            }
    }
}

const AdminAnalyticsService = {

    getLayoutDataById(appId, emailId, mobileNumber, layout = ANALYTICS_PAGES.DASHBOARD, salesChannelType = SALES_CHANNEL_TYPE.E_COMM) {
        layout = getLayoutName(layout);
        const axiosOption = Object.assign({
            data: {
                "email": emailId || null,
                "mobile": mobileNumber || null,
                'channel_type' : salesChannelType
            }
        }, {params: {}}, getCommonHeaderOptions());
        return ApiService.post(ADMIN_URLS.ANALYTICS_LAYOUT(appId, layout), axiosOption);
    },
    resetLayoutDataByEmailId(appId, emailId, mobile, layout = ANALYTICS_PAGES.DASHBOARD) {
        layout = layout === ANALYTICS_PAGES.DASHBOARD ? 'dashboard' : 'report';
        const axiosOption = Object.assign({
            data: {
                "email": emailId || null,
                "mobile": mobile || null
            }
        }, {params: {}}, getCommonHeaderOptions());
        return ApiService.post(ADMIN_URLS.ANALYTICS_LAYOUT(appId, layout, 'reset'), axiosOption);
    },
    getChartOrStatData(suffixUrl, appId, filters, page, extremeSuffix = '') {
        let screen=screenSize.GET_SCREEN_SIZE();
        const axiosOption = Object.assign({data: {...filters, page: page,  screen_size: screen}}, {params: {}}, getCommonHeaderOptions());
        return ApiService.post(ADMIN_URLS.ANALYTICS_GENERIC_URL_SCHEMES(suffixUrl, appId, extremeSuffix), axiosOption);
    },
    saveLayout(emailId, mobileNumber, layoutData, appId, layout = ANALYTICS_PAGES.DASHBOARD) {
        const layoutSuffix = layout === ANALYTICS_PAGES.DASHBOARD ? 'dashboard' : 'report';
        const axiosOption = Object.assign({
            data: {
                "email": emailId || null,
                "mobile": mobileNumber || null,
                configuration: getDataForLayouts(layout, layoutData),
            }
        }, {params: {}}, getCommonHeaderOptions());
        return ApiService.post(ADMIN_URLS.ANALYTICS_LAYOUT(appId, layoutSuffix, 'save'), axiosOption);
    },
    requestSalesDump(appId, filters) {
        const axiosOption = Object.assign({
            data: {
                ...filters
            }
        }, {params: {}}, getCommonHeaderOptions());
        return ApiService.post(ADMIN_URLS.ANALYTICS_GENERIC_URL_SCHEMES('sales_dump', appId, 'download'), axiosOption);
    },
    checkSalesDumpStatusOrCancel(jobId, appId, extremeSuffix = 'check_status') {
        const axiosOption = Object.assign({
            data: {}
        }, {params: {}}, getCommonHeaderOptions());
        return ApiService.get(ADMIN_URLS.ANALYTICS_GENERIC_URL_SCHEMES('sales_dump', appId, `${extremeSuffix}/${jobId}`), axiosOption);
    },
    componentSpecificDownload(filters, downloadUrl) {
        const axiosOption = Object.assign({
            data: {
                ...filters
            }
        }, {params: {}}, getCommonHeaderOptions());
        return ApiService.post(ADMIN_URLS.ANALYTICS_GENERIC_URL_SCHEMES(downloadUrl, null, ''), axiosOption);
    },
};

export default AdminAnalyticsService;
