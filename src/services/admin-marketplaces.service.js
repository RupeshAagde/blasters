import ApiService from './api.service';
import ADMIN_URLS from './admin-url.service';
import { getCommonHeaderOptions } from './utils.service.js';

const AdminOrdersService = {
    // fetch registered marketplaces for company
    fetchRegieteredMarketplaces(companyId) {
        return ApiService.get(ADMIN_URLS.MARKETPLACES(companyId), {});
    },
    // fetch marketplaces for company, having access
    fetchAccessibleMarketplaces(companyId) {
        return ApiService.get(ADMIN_URLS.MARKETPLACES_ACCESS(companyId), {});
    },
    getMarktplaceConfig(companyId, channelId) {
        return ApiService.get(
            ADMIN_URLS.MARKETPLACE_CONFIG(companyId, channelId),
            {}
        );
    },
    getMarketplaceStatus(companyId, marketplace) {
        return ApiService.get(
            ADMIN_URLS.MARKETPLACE_STATUS(companyId, marketplace),
            {}
        );
    },
    updateMarketplaceStatus(companyId, marketplace, body) {
        let axiosOption = Object.assign(
            {},
            {
                data: body
            }
        );
        return ApiService.put(
            ADMIN_URLS.MARKETPLACE_STATUS(companyId, marketplace),
            axiosOption
        );
    },
    createMarktplaceConfig(companyId, channelId, config, queryParams) {
        let axiosOption = Object.assign(
            {},
            {
                data: config,
                params: queryParams
            }
        );
        return ApiService.post(
            ADMIN_URLS.MARKETPLACE_CONFIG(companyId, channelId),
            axiosOption
        );
    },
    updateMarktplaceConfig(companyId, channelId, config, queryParams) {
        let axiosOption = Object.assign(
            {},
            {
                data: config,
                params: queryParams
            }
        );
        return ApiService.put(
            ADMIN_URLS.MARKETPLACE_CONFIG(companyId, channelId),
            axiosOption
        );
    },
    updateInventorySyncConfig(companyId, channelId, config, params) {
        let axiosOption = Object.assign(
            {},
            {
                data: config,
                params
            }
        );
        return ApiService.put(
            ADMIN_URLS.MARKETPLACE_SYNC_CONFIG(companyId, channelId),
            axiosOption
        );
    },
    deleteMarketplaceConfig(companyId, channelId) {
        return ApiService.del(
            ADMIN_URLS.MARKETPLACE_CONFIG(companyId, channelId),
            {}
        );
    },
    fetchStoreMapping(companyId, channelId) {
        return ApiService.get(
            ADMIN_URLS.MARKETPLACE_STORES(companyId, channelId),
            {}
        );
    },
    updateStoreMapping(companyId, channelId, storeMapping) {
        let axiosOption = Object.assign(
            {},
            {
                data: {
                    store_mapping: storeMapping,
                    store_mapping_enabled: true
                }
            }
        );
        return ApiService.put(
            ADMIN_URLS.MARKETPLACE_STORES_MAPPING(companyId, channelId),
            axiosOption
        );
    },
    searchMarketPlaceLogs(payload) {
        const body = {
            start_date: payload.fromDate,
            company_id: payload.companyId,
            end_date: payload.toDate,
            marketplace_name: payload.marketplace,
            identifier: payload.identifier,
            identifier_value: payload.identifierValue
        };
        let axiosOption = Object.assign(
            {},
            {
                data: body,
                params: payload.query
            }
        );
        return ApiService.post(
            ADMIN_URLS.SEARCH_MARKETPLACE_LOGS(),
            axiosOption
        );
    },
    fetchMarketPlaceLogs(
        startDate,
        endDate,
        marketplaceName,
        query,
        companyId
    ) {
        const body = {
            start_date: startDate,
            company_id: companyId,
            end_date: endDate,
            marketplace_name: marketplaceName
        };
        let axiosOption = Object.assign(
            {},
            {
                data: body,
                params: query
            }
        );
        return ApiService.post(ADMIN_URLS.MARKETPLACE_LOGS(), axiosOption);
    },
    exportMarketPlaceLogs(query, body) {
        let axiosOption = Object.assign(
            {},
            {
                data: body,
                params: query
            }
        );
        return ApiService.post(ADMIN_URLS.EXPORT_CSV(), axiosOption);
    },
    getExportLogsJobStatus(jobId) {
        let axiosOption = {};
        return ApiService.get(ADMIN_URLS.EXPORT_JOB_STATUS(jobId), axiosOption);
    },
    triggerInvUpdates(updateType, companyId, marketplace, body) {
        let axiosOption = Object.assign(
            {},
            {
                data: body
            }
        );
        return ApiService.post(
            ADMIN_URLS.INVENTORY_UPDATES(updateType, companyId, marketplace),
            axiosOption
        );
    },
    uploadSKUMapping(body) {
        let axiosOption = Object.assign(
            {},
            {
                data: body
            }
        );
        let companyId = body.meta ? body.meta.company_id : "";
        return ApiService.post(ADMIN_URLS.MARKETPLACES_ID_MAP(companyId), axiosOption);
    },
    getSKUMapping() {
        return ApiService.post(ADMIN_URLS.MARKETPLACES_ID_MAP(), {});
    },
    deleteSKUMapping(params) {
        let axiosOption = Object.assign({}, { params });
        return ApiService.del(ADMIN_URLS.MARKETPLACES_ID_MAP(), axiosOption);
    },
    getMarketplaceIdentifiers(companyId) {
        return ApiService.get(ADMIN_URLS.MARKETPLACE_IDENTIFIERS(companyId), {});
    },
    getArticleIdentifiers(companyId) {
        return ApiService.get(ADMIN_URLS.ARTICLE_IDENTIFIERS(companyId), {});
    },
    downloadSKUMapping(params, companyId) {
        let axiosOption = Object.assign({}, { data: params });
        return ApiService.post(ADMIN_URLS.DOWNLOAD_MAPPING(companyId), axiosOption);
    },
    getExportDownloadJobStatus(params, companyId) {
        let axiosOption = Object.assign({}, { params });
        return ApiService.get(ADMIN_URLS.DOWNLOAD_JOB_STATUS(companyId), axiosOption);
    },
    getMappedSkuList(marketplace, companyId, params) {
        let axiosOption = Object.assign({}, { params });
        return ApiService.get(
            ADMIN_URLS.SKU_LIST(marketplace, companyId),
            axiosOption
        );
    },
    getSkuMappingsOfItem(itemId, marketplace, companyId) {
        let axiosOption = Object.assign({}, {});
        return ApiService.get(
            ADMIN_URLS.ITEM_MAPPINGS(itemId, marketplace, companyId),
            axiosOption
        );
    },
    getProducts(params) {
        let axiosOption = Object.assign({}, { params: params });
        return ApiService.get(ADMIN_URLS.PRODUCTS(), axiosOption);
    },
    getIP() {
        return ApiService.getMisc('https://api.ipify.org/?format=json', {});
    },
    fetchAllPlatforms() {
        return ApiService.get(ADMIN_URLS.PLATFORM_OPT_IN(), {});
    },
    updatePlatformsOptIn(body) {
        let axiosOption = Object.assign({}, { data: body });
        return ApiService.post(ADMIN_URLS.PLATFORM_OPT_IN_MARKETPLACE(body.platform), axiosOption);
    },
    getStoreDetails(params) {
        let axiosOption = Object.assign({}, { params });
        return ApiService.get(ADMIN_URLS.STORE_DETAILS(), axiosOption);
    },
    getBrandDetails(params) {
        let axiosOption = Object.assign({}, { params });
        return ApiService.get(ADMIN_URLS.BRAND_DETAILS(), axiosOption);
    },
    autoMapProducts(companyId, marketplace) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.post(
            ADMIN_URLS.AUTO_MAP_PRODUCTS(companyId, marketplace),
            axiosOption
        );
    }
};

export default AdminOrdersService;
