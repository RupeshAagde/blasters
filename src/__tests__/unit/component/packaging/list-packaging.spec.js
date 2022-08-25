'use strict';
import ListPackaging from '@/components/packaging/list-packaging.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { GET_PACKAGING_PRODUCTS } from '../../../../store/getters.type';
import {
    CLEAR_PRODUCT,
    FETCH_PACKAGING_PRODUCTS
} from '../../../../store/action.type';
import mocks from './fixtures/mocks';
import VueRouter from 'vue-router';
let wrapper;
let category = {
    id: 1,
    value: 1
};
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
let router = new VueRouter();
let store = new Vuex.Store({
    modules: {
        packaging: {
            state: {},
            getters: {
                async [GET_PACKAGING_PRODUCTS](data) {
                    return mocks.products;
                }
            },
            actions: {
                async [CLEAR_PRODUCT]() {
                    return '';
                },
                async [FETCH_PACKAGING_PRODUCTS]() {
                    return {
                        page: {
                            total_item_count: 1,
                            current: 1,
                            has_next: false
                        }
                    };
                }
            }
        },
        dispatch: jest.fn()
    }
});
const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
describe('Test suite for list-packagiing', () => {
    beforeEach(async () => {
        wrapper = mount(ListPackaging, { localVue, store, router });
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('should test for requestParams', () => {
        let res = wrapper.vm.requestParams();
        expect(res).toStrictEqual({ page_no: 1, page_size: 10 });
        wrapper.vm.packagingSearchValue = 'test';
        res = wrapper.vm.requestParams();
        expect(res).toStrictEqual({ q: 'test' });
    });
    it('should check for pageOptionChange', () => {
        wrapper.vm.pageOptionChange({ current: 2, limit: 10 });
        expect(wrapper.vm.pagination).toStrictEqual({
            current: 2,
            limit: 10,
            next_page: false,
            total: 1
        });
    });
    it('should call the handleAddPackaging without any errors', () => {
        wrapper.vm.handleAddPackaging();
    });
    it('should check for handleChange', () => {
        wrapper.vm.handleChange('test input');
        sleep(1000).then(() => {
            expect(wrapper.vm.packagingSearchValue).toBe('test input');
            expect(wrapper.vm.fetchProducts).toHaveBeenCalled();
        });
    });
});
