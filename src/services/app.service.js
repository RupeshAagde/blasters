import ApiService from './api.service';
import URLS from './domain.service';
import { getCommonHeaderOptions } from './utils.service.js';
import root from 'window-or-global';

const AppService = {
    fetchTheme() {
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.GET_APP_THEME(), axiosOption);
    },
    fetchCurrencies() {
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.GET_CURRENCY_LIST(), axiosOption);
    },
    fetchCurrencyExchange(params) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(), {
            params: params
        });
        return ApiService.get(URLS.GET_CURRENCY_EXCHANGE(), axiosOption);
    },
    fetchAppInfo(company_id, application_id) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.GET_APP_INFO(company_id, application_id), axiosOption);
    },
    // fetchAppFeatures() {
    //     let appInfo = getAppInfo();
    //     let axiosOption = Object.assign({}, getCommonHeaderOptions());
    //     return ApiService.get(URLS.APP_FEATURES(appInfo.company_id, appInfo._id), axiosOption);
    // },
    // fetchAppTokens() {
    //     const appInfo = getAppInfo();
    //     let axiosOption = Object.assign({}, getCommonHeaderOptions());
    //     return ApiService.get(URLS.APP_TOKENS(appInfo.company_id, appInfo._id), axiosOption);
    // },
    // fetchCompanyIds(params) {
    //     const appInfo = getAppInfo();
    //     let axiosOption = Object.assign({}, getCommonHeaderOptions(), {
    //         params: params
    //     });
    //     return ApiService.get(URLS.GET_APP_COMPANIES(appInfo.company_id, appInfo._id), axiosOption);
    // },
    // fetchStoreIds(params) {
    //     const appInfo = getAppInfo();
    //     let axiosOption = Object.assign({}, getCommonHeaderOptions(), {
    //         params: params
    //     });
    //     return ApiService.get(URLS.GET_APP_STORES(appInfo.company_id, appInfo._id), axiosOption);
    // },
    // updateAppFeatures(body = {}) {
    //     let appInfo = getAppInfo();
    //     const axiosOption = Object.assign({}, { data: body },
    //         getCommonHeaderOptions()
    //     );
    //     return ApiService.post(URLS.APP_FEATURES(appInfo.company_id, appInfo._id), axiosOption);
    // },
    fetchScreenSaver(params) {
        let getCustomHeaderOptions = getCommonHeaderOptions();
        getCustomHeaderOptions.headers['x-device-platform'] = 'web';
        let axiosOption = Object.assign({}, getCustomHeaderOptions, {
            params: params
        });
        return ApiService.get(URLS.SCREEN_SAVER(), axiosOption);
    },
    fetchAnnouncements(params) {
        let getCustomHeaderOptions = getCommonHeaderOptions();
        // getCustomHeaderOptions.headers['x-device-platform'] = 'web';
        let axiosOption = Object.assign({}, getCustomHeaderOptions, {
            params: params
        });
        return ApiService.get(URLS.ANNOUNCEMENTS(), axiosOption);
    },
    // fetchDeploymentStores(params, appDetails = null) {
    //     let header = getCommonHeaderOptions();
    //     const appInfo = appDetails && appDetails._id ? appDetails : getAppInfo();
    //     if (appDetails) {
    //         header.headers['x-application-id'] = appDetails._id;
    //         header.headers['x-application-token'] = appDetails.token;
    //     }
    //     let axiosOption = Object.assign({}, header, {
    //         params: params
    //     });
    //     return ApiService.get(URLS.DEPLOYMENT_STORES(appInfo.company_id, appInfo._id), axiosOption);
    // },
    // fetchDeploymentMetaStores() {
    //     const appInfo = getAppInfo();
    //     let axiosOption = Object.assign({}, getCommonHeaderOptions(), {});
    //     return ApiService.get(URLS.DEPLOYMENT_META_STORES(appInfo.company_id, appInfo._id), axiosOption);
    // },
    // fetchfilteredDeploymentStore(body, appDetails = null) {
    //     const appInfo = appDetails && appDetails._id ? appDetails : getAppInfo();
    //     let header = getCommonHeaderOptions();
    //     let axiosOption = Object.assign({}, { data: body }, header, {});
    //     return ApiService.post(
    //         URLS.FILTER_DEPLOYMENT_META_STORES(appInfo._id),
    //         axiosOption
    //     );
    // },
    // fetchfilteredDeploymentStoresStaffAccessible(params, appDetails = null) {
    //     const appInfo = appDetails && appDetails._id ? appDetails : getAppInfo();
    //     let header = getCommonHeaderOptions();
    //     let axiosOption = Object.assign({}, header, { params });
    //     return ApiService.get(
    //         URLS.DEPLOYMENT_STORES_STAFF_ACCESSIBLE(appInfo._id),
    //         axiosOption
    //     );
    // },
    // updateStoreDeployment(body) {
    //     const appInfo = getAppInfo();
    //     let axiosOption = Object.assign({}, { data: body },
    //         getCommonHeaderOptions(), {}
    //     );
    //     return ApiService.post(URLS.DEPLOYMENT_META_STORES(appInfo.company_id, appInfo._id), axiosOption);
    // },
    // fetchCurrentApp(params) {
    //     const appInfo = getAppInfo();
    //     let axiosOption = Object.assign({}, getCommonHeaderOptions(), {});
    //     return ApiService.get(URLS.CURRENT_APPLICATION(appInfo.company_id, appInfo._id), axiosOption);
    // },
    generateAppToken(company_id, application_id) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.post(URLS.APPLICATION_TOKEN(company_id, application_id), axiosOption);
    },
    deleteAppToken(company_id, application_id, token) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.del(URLS.APPLICATION_TOKEN(company_id, application_id, token), axiosOption);
    }
};
export default AppService;