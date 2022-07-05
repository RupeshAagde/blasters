'use strict';

import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import root from 'window-or-global';
const envVars = root.env || {};

/**
 * https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/packaging/v1.0/
 */
const packagingServiceURL = envVars.WEIRDWOLF_ADMIN_URL + 'v1.0/';

/**
 * example
 * 'https://api.fyndx0.de/service/___/administrator/catalog/v1.0/company/84/application/629616a1d7c74d3915f8f4e8/raw-products'
 */
const appProductsServiceURL =
    envVars.SILVERBOLT_ACAT_URL +
    `v1.0/company/${envVars.COMPANY_ID}/application/${envVars.APPLICATION_ID}/raw-products`;
console.log(packagingServiceURL,"packaging service URL - app products service url",appProductsServiceURL)
const PackagingService = {
    /**
     * @author Rohan Shah
     * @memberof PackagingService
     * @param {Object} params - {
     * page_no: Number
     * page_size: Number
     * q: Group categroy value  / slug name
     * }
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
            packagingServiceURL + 'group-categories/',
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @memberof PackagingService
     * @param {*} slug String
     * @description Fetches the group category detail from the BE
     * @type GET
     * @returns Promise
     */
    getGroupCategoryDetail(slug) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(
            packagingServiceURL + `group-categories/${slug}`,
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @memberof PackagingService
     * @param {Object} params - {
     * page_no: Number
     * page_size: Number
     * q: packaging product name
     * }
     * @description Fetches the packaging products from the BE
     * @type GET
     * @returns Promise
     */
    getPackagingProducts(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(packagingServiceURL + 'product/', axiosOptions);
    },
    /**
     * @author Rohan Shah
     * @memberof PackagingService
     * @param {*} productId Mongo ID
     * @description Fetches the packaging product detail from the BE
     * @type GET
     * @returns Promise
     */
    getProductDetail(productId) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(
            packagingServiceURL + `product/${productId}`,
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @memberof PackagingService
     * @param {Object} data - {
     * name: String
     * categories: [categoryUid]
     * }
     * @description Creates a new category and its configuration
     * @type POST
     * @returns Promise
     */
    createGroupCategory(data) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.post(
            packagingServiceURL + 'group-categories/',
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @memberof PackagingService
     * @param {Object} data - {
     * name: String
     * categories: [categoryUid]
     * }
     * @param {*} slug - String slug name
     * @description Updates a category and its configuration
     * @type PUT
     * @returns Promise
     */
    updateGroupCategory(data, slug) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.put(
            packagingServiceURL + `group-categories/${slug}`,
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @memberof PackagingService
     * @param {Object} data - {
     *   item_id: Item UID,
     *  is_bulk: Boolean,
     *    error_rate: Number,
     *   is_l3_specific: Boolean,
     *  dead_weight_in_kg: Number,
     *   dimensions: {
     *       length : Number,
     *       width : Number,
     *       height: Number,
     *   },
     *   maximum_order: Number,
     *   weight: Number,
     *   default_package : {
     *       quantity: {
     *           max: 1,
     *           min: 1
     *       },
     *       l3_categories:[Category UIDs]
     *   },
     *   l3_mapping: Array
     * }
     * @description Creates a new packaging product
     * @type POST
     * @returns Promise
     */
    createPackagingProduct(data) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.post(packagingServiceURL + 'product/', axiosOptions);
    },
    /**
     * @author Rohan Shah
     * @memberof PackagingService
     * @param {Object} data - {
     *   item_id: Item UID,
     *  is_bulk: Boolean,
     *    error_rate: Number,
     *   is_l3_specific: Boolean,
     *  dead_weight_in_kg: Number,
     *   dimensions: {
     *       length : Number,
     *       width : Number,
     *       height: Number,
     *   },
     *   maximum_order: Number,
     *   weight: Number,
     *   default_package : {
     *       quantity: {
     *           max: 1,
     *           min: 1
     *       },
     *       l3_categories:[Category UIDs]
     *   },
     *   l3_mapping: Array
     * }
     * @param {*} _id - Mongo ID for a packaging product
     * @description Updates a packaging product
     * @type PUT
     * @returns Promise
     */
    updatePackagingProduct(data, _id) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.put(
            packagingServiceURL + `product/${_id}`,
            axiosOptions
        );
    },
    /**
     * @author Rohan Shah
     * @memberof PackagingService
     * @param {Object} params - {
     * page_no: Number
     * page_size: Number
     * q: raw product name for search query
     * }
     * @description Calls the API to get company products
     * @returns Promise
     */
    getAppProducts(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(appProductsServiceURL, axiosOptions);
    }
};
export default PackagingService;
