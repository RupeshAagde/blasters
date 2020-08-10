import CompanyService from '@/services/company-admin.service';

import { FETCH_METRICS } from '../action.type';

import { GET_METRICS } from '../getters.type';

import { UPDATE_METRICS } from '../mutation.type';

const getDefaultState = () => {
    return {
        metrics: null
    };
};

const state = getDefaultState();

const getters = {
    [GET_METRICS](state) {
        return state.metrics;
    }
};

const mutations = {
    [UPDATE_METRICS](state, { data }) {
        state.metrics = data;
    }
};

const actions = {
    [FETCH_METRICS]({ commit }, body) {
        return CompanyService.fetchMetrics(body)
            .then((res) => {
                commit(UPDATE_METRICS, { data: res.data });
                return res.data;
            })
            .catch((err) => {
                console.log(err, 'error err');
            });
    }
};

export function createCompanyStore() {
    return {
        state: getDefaultState(),
        actions,
        mutations,
        getters
    };
}
