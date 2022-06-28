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
        const axiosOptions = Object.assign(getCommonHeaderOptions());
        return ApiService.get(URLS.EXTENSION_REVIEW(review_id), axiosOptions);
    },
    updateExtensionReviewInfo(review_id = '', data) {
        const axiosOptions = Object.assign(getCommonHeaderOptions(), {
            data: data
        });
        return ApiService.patch(URLS.EXTENSION_REVIEW(review_id), axiosOptions);
    },
    getPublicExtensions(slug = '', params = {}) {
        let axiosOption = Object.assign({
            params: params
        });
        return ApiService.get(URLS.PUBLIC_EXTENSIONS(), axiosOption);
    },
    getAllPublicExtensionCategories(params) {
        let axiosOption = Object.assign({
            params: params
        });
        return ApiService.get(URLS.PUBLIC_EXTENSION_CATEGORIES(), axiosOption);
    },
    saveExtensionCollection(data) {
        const axiosOption = Object.assign(getCommonHeaderOptions(), {
            data: data
        });
        return ApiService.post(URLS.SAVE_EXTENSION_COLLECTION(), axiosOption);
    },
    getExtensionCollectionDetails(id) {
        return ApiService.get(URLS.GET_EXTENSION_COLLECTIONS_DETAILS(id));
    },
    getExtensionCollections(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.GET_EXTENSION_COLLECTIONS(), axiosOptions);
    },
    updateExtensionCollection(data, id) {
        const axiosOption = Object.assign(getCommonHeaderOptions(), {
            data: data
        });
        return ApiService.put(
            URLS.UPDATE_EXTENSION_COLLECTION(id),
            axiosOption
        );
    },
    getAllExtensionCategories() {
        return ApiService.get(URLS.PUBLIC_EXTENSION_CATEGORIES());
    },
    checkDuplicateSlug(slug = '') {
        return ApiService.get(URLS.CHECK_DUPLICATE_SLUG(slug));
    }
};
export default UserService;
