'use strict';
import ListPackaging from '@/components/packaging/list-packaging.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import {
    GET_PACKAGING_PRODUCTS
} from '../../../../store/getters.type';
import { CLEAR_PRODUCT } from '../../../../store/action.type';
import mocks from './fixtures/mocks';
let wrapper;
let category = {
    id: 1,
    value: 1
};
const localVue = createLocalVue();
localVue.use(Vuex);
let store = new Vuex.Store({
    modules: {
        packaging: {
            state: {},
            getters: {
                async [GET_PACKAGING_PRODUCTS](data) {
                    return mocks.products;
                },
            },
            actions: {
                async [CLEAR_PRODUCT]() {
                    return ""
                }
            }
        },
        dispatch: jest.fn()
    }
});

describe("Test suite for list-packagiing",()=>{
    beforeEach(async () => {
        wrapper = mount(ListPackaging, { localVue, store });
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it("should test for requestParams",()=>{
        let res = wrapper.vm.requestParams()
        expect(res).toStrictEqual({"page_no": 1, "page_size": 10})
        wrapper.vm.packagingSearchValue = "test"
        res = wrapper.vm.requestParams()
        expect(res).toStrictEqual({"page_no": 1, "page_size": 10,"name": "test"})
    })
    it("should check for pageOptionChange",()=>{
        wrapper.vm.pageOptionChange({current:2,limit:10})
        expect(wrapper.vm.pagination).toStrictEqual({"current": 2, "limit": 10, "next_page": true, "total": 0})
    })
})