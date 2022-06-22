import {
    CLEAR_CATEGORY,
    CLEAR_PRODUCT,
    EDIT_CATEGORY,
    EDIT_PRODUCT,
    FETCH_GROUP_CATEGORIES,
    FETCH_PACKAGING_PRODUCTS,
    SAVE_CATEGORY,
    SAVE_PACKAGING_PRODUCT,
    FETCH_L3_CATEGORIES,
    FETCH_COMPANY_PRODUCTS
} from '../action.type';

import {
    GET_CATEGORIES,
    GET_EDIT_CATEGORY,
    GET_EDIT_PRODUCT,
    GET_PACKAGING_PRODUCTS
} from '../getters.type';

import {
    SET_CATEGORIES,
    SET_CLEAR_CATEGORY,
    SET_CLEAR_PRODUCT,
    SET_EDIT_CATEGORY,
    SET_EDIT_PRODUCT,
    SET_PACKAGING_PRODUCTS
} from '../mutation.type';
import PackagingService from '../../services/packaging.service';
import CompanyService from '../../services/company-admin.service';
const getDefaultState = () => {
    return {
        products: [],
        categories: [],
        categoryConfiguration: {},
        packagingProduct: {}
    };
};

const getters = {
    [GET_PACKAGING_PRODUCTS](state) {
        return state.products;
    },
    [GET_CATEGORIES](state) {
        return state.categories;
    },
    [GET_EDIT_CATEGORY](state) {
        return state.categoryConfiguration;
    },
    [GET_EDIT_PRODUCT](state) {
        return state.packagingProduct;
    }
};

const mutations = {
    [SET_PACKAGING_PRODUCTS](state, data) {
        state.products = data;
    },
    [SET_CATEGORIES](state, data) {
        state.categories = data;
    },
    [SET_EDIT_CATEGORY](state, data) {
        state.categoryConfiguration = data;
    },
    [SET_EDIT_PRODUCT](state, data) {
        state.packagingProduct = data;
    },
    [SET_CLEAR_PRODUCT](state) {
        state.packagingProduct = {};
    },
    [SET_CLEAR_CATEGORY](state) {
        state.categoryConfiguration = {};
    }
};

const actions = {
    [FETCH_PACKAGING_PRODUCTS]({ commit }, params) {
        return PackagingService.getPackagingProducts(params)
            .then((res) => {
                commit(SET_PACKAGING_PRODUCTS, res.data.items);
                return res.data;
            })
            .catch(() => {
                return { error: true };
            });
    },
    [FETCH_GROUP_CATEGORIES]({ commit }, params) {
        return PackagingService.getGroupCategories(params)
            .then((res) => {
                commit(SET_CATEGORIES, res.data.items);
                return res.data;
            })
            .catch(() => {
                return { error: true };
            });
    },
    [EDIT_CATEGORY]({ commit }, data) {
        commit(SET_EDIT_CATEGORY, data);
    },
    [EDIT_PRODUCT]({ commit }, productId) {
        return PackagingService.getProductDetail(productId)
            .then((res) => {
                commit(SET_EDIT_PRODUCT, res.data);
                return res.data;
            })
            .catch(() => {
                return { error: true };
            });
    },
    [SAVE_PACKAGING_PRODUCT](req) {
        const { data, _id, isEdit } = req;
        return PackagingService[
            isEdit ? 'updatePackagingProduct' : 'createPackagingProduct'
        ](data, isEdit ? _id : '')
            .then((res) => {
                return res.data;
            })
            .catch(() => {
                return { error: true };
            });
    },
    [SAVE_CATEGORY]({ commit }, reqObj) {
        const { data, slug, isEdit } = reqObj;
        return PackagingService[
            isEdit ? 'updateGroupCategory' : 'createGroupCategory'
        ](data, isEdit ? slug : '')
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return {
                    error: true,
                    statusCode: err.response.status,
                    msg: err.response.data.message
                };
            });
    },
    [CLEAR_PRODUCT]({ commit }) {
        commit(SET_CLEAR_PRODUCT);
    },
    [CLEAR_CATEGORY]({ commit }) {
        commit(SET_CLEAR_CATEGORY);
    },
    // get L3 categories
    [FETCH_L3_CATEGORIES]({ commit }, params) {
        params.level = 3;
        params.page_size = 10000;
        return CompanyService.fetchCategory_v2(params)
            .then((res) => {
                return res.data.items;
            })
            .catch((err) => {
                return { error: true };
            });
    },
    [FETCH_COMPANY_PRODUCTS]({ commit }, params) {
        params.page_size = 10000;
        return PackagingService.getAppProducts(params)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return {
                    error: true
                };
            });
    }
};

export function createPackagingStore() {
    return {
        state: getDefaultState(),
        actions,
        mutations,
        getters
    };
}
