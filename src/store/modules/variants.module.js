import {
    FETCH_VARIANTS,
    CREATE_EDIT_VARIANTS,
    FETCH_VARIANT_DISPLAY_TYPE,
    FETCH_TEMPLATES,
    FETCH_ATTRIBUTES
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
    [FETCH_VARIANTS]({ commit }, req) {
        const { params, uid } = req
        return CatalogService.fetchVariants(params, uid)
            .then((res) => {
                // commit(SET_VARIANTS, res.data)
                return res.data
            }).catch((err) => {
                return { error: true, err }
            })
    },
    [CREATE_EDIT_VARIANTS]({ commit }, req) {
        let promise;
        if (req.uid) {
            promise = CatalogService.updateVariant(req)
        } else {
            promise = CatalogService.saveVariant(req)
        }
        return promise.then((res) => {
            return res
        }).catch((err) => {
            return { error: true, err }
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
                    return reject({ error: true, err })
                })
            });

    },
    [FETCH_TEMPLATES]({ commit }, params) {
        return CompanyService.fetchProductTemplates(params)
            .then((res) => {
                let temp = []
                let temp_dep_set = {}
                res.data.items.forEach((ele) => {
                    if (ele.is_active) {
                        temp.push({
                            text: ele.name,
                            value: ele.slug,
                            id: ele.id,
                            attribute: ele.attributes,
                            departments: ele.departments
                        })
                        if (temp_dep_set.hasOwnProperty(ele.slug)) {
                            temp_dep_set[ele.slug] = temp_dep_set[ele.slug].concat(ele.slug)
                        } else {
                            temp_dep_set[ele.slug] = ele.slug
                        }

                    }
                });
                return new Promise((resolve, reject) => {
                    return resolve({ temp, temp_dep_set })
                })
            })
            .catch((err) => {
                return new Promise((resolve, reject) => {
                    return reject({ error: true, err })
                })
            });
    },
    [FETCH_ATTRIBUTES]({ commit }, params) {
        return CatalogService.fetchAttributes(params)
            .then((res) => {
                let data = []
                res.data.items.map((element) => {
                    data.push({
                        text: element.name,
                        value: element.slug
                    })
                });
                return data
            })
            .catch((err) => {
                return { error: true, err }
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
