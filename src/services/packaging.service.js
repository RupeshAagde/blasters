'use strict';

import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import root from 'window-or-global';
const envVars = root.env || {};

const PackagingService = {
    /**
     * @author Rohan Shah
     * @param {*} params TODO update
     * @description Fetches the group categories from the BE
     * @type GET
     * @returns Promise
     */
    getGroupCategories(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            envVars.PACKAGING_ADMIN_URL + 'group-categories/',
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @param {*} slug String
     * @description Fetches the group category detail from the BE
     * @type GET
     * @returns Promise
     */
    getGroupCategoryDetail(slug) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(
            envVars.PACKAGING_ADMIN_URL + `group-categories/${slug}`,
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @param {*} params TODO update
     * @description Fetches the packaging products from the BE
     * @type GET
     * @returns Promise
     */
    getPackagingProducts(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            envVars.PACKAGING_ADMIN_URL + 'product/',
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @param {*} productId Mongo ID
     * @description Fetches the packaging product detail from the BE
     * @type GET
     * @returns Promise
     */
    getProductDetail(productId) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(
            envVars.PACKAGING_ADMIN_URL + `product/${productId}`,
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @param {*} data TODO update
     * @description Creates a new category and its configuration
     * @type POST
     * @returns Promise
     */
    createGroupCategory(data) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.post(
            envVars.PACKAGING_ADMIN_URL + 'group-categories/',
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @param {*} data TODO update
     * @description Updates a category and its configuration
     * @type PUT
     * @returns Promise
     */
    updateGroupCategory(data, slug) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.put(
            envVars.PACKAGING_ADMIN_URL + `group-categories/${slug}`,
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @param {*} data TODO update
     * @description Creates a new packaging product
     * @type POST
     * @returns Promise
     */
    createPackagingProduct(data) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.post(
            envVars.PACKAGING_ADMIN_URL + 'product/',
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @param {*} data TODO update
     * @description Updates a packaging product
     * @type PUT
     * @returns Promise
     */
    updatePackagingProduct(data, _id) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.put(
            envVars.PACKAGING_ADMIN_URL + `product/${_id}`,
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @description Calls the API to get company products
     * @returns Promise
     */
    getAppProducts(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(envVars.APP_PRODUCTS, axiosOptions);
    }
};
export default PackagingService;
