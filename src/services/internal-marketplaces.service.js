'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object } from 'window-or-global';

const InternalMarketplaceAdminService = {
    fetchMarketplaces(params={}) {
        let axiosOption = Object.assign({ params },getCommonHeaderOptions());
        return ApiService.get(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE(), axiosOption);
    },
    fetchMarketplaceDetails(id) {
        let axiosOption = Object.assign({ },getCommonHeaderOptions());
        return ApiService.get(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE(id), axiosOption);
    },
    createMarketPlace(data){
        const axiosOptions = Object.assign({},{data}, getCommonHeaderOptions());
        return ApiService.post(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE(), axiosOptions);
    },
    updateMarketPlaceDetails(id, data){
        const axiosOptions = Object.assign({},{data}, getCommonHeaderOptions());
        return ApiService.put(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE(id), axiosOptions);
    }
};
export default InternalMarketplaceAdminService;