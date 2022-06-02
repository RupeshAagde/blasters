import BillingSubscriptionService from '@/services/billing.service';

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
        return state[CURRENT_ACTIVE_SUBSCRIPTION];
    },
};

const mutations = {
    [SET_PACKAGING_PRODUCTS](state, data) {
       state.products = data;
    },
};

const actions = {
    [FETCH_PACKAGING_PRODUCTS]({ commit }, params) {
        return BillingSubscriptionService.getCurrentActivePlan(params).then(
            res => {
                commit(SET_CURRENT_ACTIVE_SUBSCRIPTION, res.data);
                return res.data;
            }
        );
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
