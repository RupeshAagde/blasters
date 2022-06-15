import {
    EDIT_CATEGORY,
    EDIT_PRODUCT,
    FETCH_CATEGORIES,
    FETCH_PACKAGING_PRODUCTS,
    SAVE_CATEGORY,
    SAVE_PACKAGING_PRODUCT
} from '../action.type';

import {
    GET_CATEGORIES,
    GET_EDIT_CATEGORY,
    GET_EDIT_PRODUCT,
    GET_PACKAGING_PRODUCTS
} from '../getters.type';

import {
    SET_CATEGORIES,
    SET_EDIT_CATEGORY,
    SET_EDIT_PRODUCT,
    SET_PACKAGING_PRODUCTS
} from '../mutation.type';
import PackagingService from '../../services/packaging.service';
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
    [FETCH_CATEGORIES]({ commit }, params) {
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
    [EDIT_PRODUCT]({ commit }, data) {
        commit(SET_EDIT_PRODUCT, data);
    },
    [SAVE_PACKAGING_PRODUCT](data) {
        return PackagingService.createPackagingProduct(data)
            .then((res) => {
                return res.data;
            })
            .catch(() => {
                return { error: true };
            });
    },
    [SAVE_CATEGORY](data) {
        return PackagingService.createGroupCategory(data)
            .then((res) => {
                return res.data;
            })
            .catch(() => {
                return { error: true };
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
