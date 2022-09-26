import {
    FETCH_VARIANTS
} from '../action.type'

import {
    SET_VARIANTS
} from '../mutation.type'

import {
    GET_VARIANTS
} from '../getters.type'

import CatalogService from '@/services/catalog.service';

const getDefaultState = () => {
    return {
        variantList: [],
        variant: {},
    }
}

const actions = {
    [FETCH_VARIANTS]({ commit }, params, uid) {
        return CatalogService.fetchVariants(params, uid)
            .then((res) => {
                // commit(SET_VARIANTS, res.data)
                return res.data
            }).catch((err) => {
                return err
            })
    }
}

const mutations = {

}

const getters = {

}


export function createVariantStore() {
    return {
        state: getDefaultState(),
        actions,
        mutations,
        getters
    }
}
