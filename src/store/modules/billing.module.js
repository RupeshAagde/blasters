import BillingSubscriptionService from '@/services/billing.service';

import {
    FETCH_CURRENT_ACTIVE_SUBSCRIPTION,
    FETCH_COMPANY_SUBSCRIPTION_LIMITS,

} from '../action.type';

import {
    GET_CURRENT_ACTIVE_SUBSCRIPTION,
    GET_COMPANY_SUBSCRIPTION_LIMITS
} from '../getters.type';

import { 
    SET_CURRENT_ACTIVE_SUBSCRIPTION,
    SET_COMPANY_MAX_APPLICATIONS_LIMIT
} from '../mutation.type';

const CURRENT_ACTIVE_SUBSCRIPTION = 'current_active_subscription';
const COMPANY_MAX_APPLICATIONS_LIMIT = 'company_max_applications_limit';


const getDefaultState = () => {
    return {
        [CURRENT_ACTIVE_SUBSCRIPTION]: {},
        [COMPANY_MAX_APPLICATIONS_LIMIT]: {},
    };
};

const state = getDefaultState();

const getters = {
    [GET_CURRENT_ACTIVE_SUBSCRIPTION](state) {
        return state[CURRENT_ACTIVE_SUBSCRIPTION];
    },
    [GET_COMPANY_SUBSCRIPTION_LIMITS](state) {
        return state[COMPANY_MAX_APPLICATIONS_LIMIT];
    },
};

const mutations = {
    [SET_CURRENT_ACTIVE_SUBSCRIPTION](state, data) {
        state[CURRENT_ACTIVE_SUBSCRIPTION] = data;
    },
    [SET_COMPANY_MAX_APPLICATIONS_LIMIT](state, data) {
        state[COMPANY_MAX_APPLICATIONS_LIMIT] = data;
    },
};

const actions = {
    [FETCH_CURRENT_ACTIVE_SUBSCRIPTION]({ commit }, params) {
        return BillingSubscriptionService.getCurrentActivePlan(params).then(
            res => {
                commit(SET_CURRENT_ACTIVE_SUBSCRIPTION, res.data);
                return res.data;
            }
        );
    },
    [FETCH_COMPANY_SUBSCRIPTION_LIMITS]({ commit }, params) {
        return BillingSubscriptionService.fetchCompanyMaxApplicationLimit(params).then(res => {
            commit(SET_COMPANY_MAX_APPLICATIONS_LIMIT, res.data);
            return res.data;
        });
    },
};

export function createBillingStore() {
    return {
        state: getDefaultState(),
        actions,
        mutations,
        getters
    };
}
