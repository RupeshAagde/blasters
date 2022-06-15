'use strict';

import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
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
    updateGroupCategory(data) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.put(
            // TODO update the :slug
            envVars.PACKAGING_ADMIN_URL + 'group-categories/:slug',
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
    updatePackagingProduct(data) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.put(
            // TODO update the :id
            envVars.PACKAGING_ADMIN_URL + 'product/:id',
            axiosOptions
        );
    }
};
export default PackagingService;
