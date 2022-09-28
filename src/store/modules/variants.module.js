import {
    FETCH_VARIANTS,
    FETCH_VARIANT_DISPLAY_TYPE,
    FETCH_TEMPLATES,
} from '../action.type'

import {
    SET_VARIANTS
} from '../mutation.type'

import {
    GET_VARIANTS
} from '../getters.type'

import CatalogService from '@/services/catalog.service';
import CompanyService from '@/services/company-admin.service';

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
                console.log(err)
            })
    },
    [FETCH_VARIANT_DISPLAY_TYPE]({ commit }, params) {
        return CatalogService.fetchChoices(params)
            .then((res) => {
                let data = res.data.items
                data.map((element) => {
                    element.text = element.value;
                    element.value = element.key;
                });
                return new Promise((resolve, reject) => {
                    return resolve(data)
                })
            })
            .catch((err) => {
                return new Promise((resolve, reject) => {
                    return reject(err)
                })
            });

    },
    [FETCH_TEMPLATES]({ commit }, params) {
        return CompanyService.fetchProductTemplates(params)
            .then((res) => {
                let data = []
                res.data.items.forEach((ele) => {
                    if (ele.is_active) {
                        data.push({
                            text: ele.name,
                            value: ele.slug,
                            id: ele.id
                        })
                    }
                });
                return new Promise((resolve, reject) => {
                    return resolve(data)
                })
            })
            .catch((err) => {
                return new Promise((resolve, reject) => {
                    return reject(err)
                })
            });
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
