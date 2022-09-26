import {
    FETCH_VARIANTS
} from '../action.type'

import {
    SET_VARIANTS
} from '../mutation.type'

import {
    GET_VARIANTS
} from '../getters.type'

const getDefaultState = () => {
    return {
        variantList: [],
        variant: {},
    }
}

const actions = {

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
