import {
    FETCH_VARIANTS,
    CREATE_EDIT_VARIANTS,
    FETCH_VARIANT_DISPLAY_TYPE,
    FETCH_TEMPLATES,
    FETCH_ATTRIBUTES
} from '../action.type'

import CatalogService from '@/services/catalog.service';
import CompanyService from '@/services/company-admin.service';
import sortBy from 'lodash/sortBy';

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
                let temp_attr_set = {}
                res.data.items.forEach((ele) => {
                    if (ele.is_active) {
                        temp.push({
                            text: ele.name,
                            value: ele.slug,
                            id: ele.id,
                        })
                        if (temp_attr_set.hasOwnProperty(ele.slug)) {
                            temp_attr_set[ele.slug] = temp_attr_set[ele.slug].concat(ele.attributes)
                        } else {
                            temp_attr_set[ele.slug] = ele.attributes
                        }

                    }
                });
                return new Promise((resolve, reject) => {
                    return resolve({ temp, temp_attr_set })
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
                data = sortBy(data, ['text'])
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
