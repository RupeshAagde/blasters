'use strict';

import URLS from './mixmaster-url.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const UserService = {
    getExtensionReviewList(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.EXTENSION_REVIEW(), axiosOptions);
    },
    getExtensionReviewInfo(review_id = '') {
        const axiosOptions = Object.assign(
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.EXTENSION_REVIEW(review_id), axiosOptions);
    },
    updateExtensionReviewInfo(review_id = '', data) {
        const axiosOptions = Object.assign(
            getCommonHeaderOptions(),
            {
                data: data
            }
        );
        return ApiService.patch(URLS.EXTENSION_REVIEW(review_id), axiosOptions);
    },
    getPublicExtensions(slug = "", params = {}) {
        let axiosOption = Object.assign({
            params: params
        })
        return ApiService.get('https://api.fyndx0.de/service/panel/partners/v1.0/extensions', axiosOption)
    },
    getAllPublicExtensionCategories(params) {
        let axiosOption = Object.assign({
            params: params
        })
        return ApiService.get('https://api.fyndx0.de/service/panel/partners/v1.0/extensions/category/all', axiosOption)
    },
    saveExtensionCollection(data) {
        const axiosOption = Object.assign(
            getCommonHeaderOptions(),
            {
                data: data
            }
        )
        return ApiService.post('http://localdev.fyndx0.de:7084/collection/extensions', axiosOption)
    }

};
export default UserService;
