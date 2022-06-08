import { FETCH_CATEGORIES, FETCH_PACKAGING_PRODUCTS } from '../action.type';

import { GET_CATEGORIES, GET_PACKAGING_PRODUCTS } from '../getters.type';

import { SET_CATEGORIES, SET_PACKAGING_PRODUCTS } from '../mutation.type';

const getDefaultState = () => {
    return {
        products: [],
        categories: []
    };
};

const getters = {
    [GET_PACKAGING_PRODUCTS](state) {
        return state.products;
    },
    [GET_CATEGORIES](state) {
        return state.categories;
    }
};

const mutations = {
    [SET_PACKAGING_PRODUCTS](state, data) {
        state.products = data;
    },
    [SET_CATEGORIES](state, data) {
        state.categories = data;
    }
};

const actions = {
    [FETCH_PACKAGING_PRODUCTS]({ commit }, params) {
        return [];
    },
    [FETCH_CATEGORIES]({ commit }, params) {
        return [];
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
