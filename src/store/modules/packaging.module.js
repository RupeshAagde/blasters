import {
    FETCH_PACKAGING_PRODUCTS
} from '../action.type';

import {
    GET_PACKAGING_PRODUCTS
} from '../getters.type';

import { 
   SET_PACKAGING_PRODUCTS
} from '../mutation.type';



const getDefaultState = () => {
    return {
        products:[]
    };
};

const getters = {
    [GET_PACKAGING_PRODUCTS](state) {
        return state.products
    },
};

const mutations = {
    [SET_PACKAGING_PRODUCTS](state, data) {
       state.products = data;
    },
};

const actions = {
    [FETCH_PACKAGING_PRODUCTS]({ commit }, params) {
        return []
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
