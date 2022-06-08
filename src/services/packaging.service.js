'use strict';

import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
const envVars = root.env || {};

const PackagingService = {
    /**
     * @author Rohan Shah
     * @param {*} params TODO update
     * @description Fetches the categories from the BE
     * @type GET
     * @returns Promise
     */
    getCategories(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(envVars.PACKAGING_ADMIN_UDL, axiosOptions);
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
        return ApiService.get(envVars.PACKAGING_ADMIN_UDL, axiosOptions);
    },
    /**
     * @author Rohan Shah
     * @param {*} data TODO update
     * @description Creates a new category and its configuration
     * @type POST
     * @returns Promise
     */
    createCategory(data) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.post(envVars.PACKAGING_ADMIN_UDL, axiosOptions);
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
        return ApiService.post(envVars.PACKAGING_ADMIN_UDL, axiosOptions);
    }
};
export default PackagingService;
