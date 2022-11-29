'use strict';
import ListCategories from '@/components/packaging/list-categories.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import {
    GET_CATEGORIES
} from '../../../../store/getters.type';
import { CLEAR_CATEGORY,FETCH_L3_CATEGORIES,FETCH_GROUP_CATEGORIES,EDIT_CATEGORY } from '../../../../store/action.type';
import mocks from './fixtures/mocks';
import VueRouter from 'vue-router';
import CategoryCard from '@/components/packaging/common/category-card.vue'
let wrapper;
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
let router = new VueRouter()
let store = new Vuex.Store({
    modules: {
        packaging: {
            state: {},
            getters: {
                async [GET_CATEGORIES](data) {
                    return mocks.products;
                },
            },
            actions: {
                async [CLEAR_CATEGORY]() {
                    return ""
                },
                async [FETCH_L3_CATEGORIES](){
                    return mocks.l3Categories
                },
                async [FETCH_GROUP_CATEGORIES](){
                    return {
                        page:{
                            total_item_count:1,
                            current:1,
                            has_next:false
                        }
                    }
                },
                async [EDIT_CATEGORY](){
                    return {}
                }
            }
        },
        dispatch: jest.fn()
    }
});
const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
describe("Test suite for list-categories",()=>{
    beforeEach(async () => {
        wrapper = mount(ListCategories, { localVue, store, router });
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it("should test for requestParams",()=>{
        let res = wrapper.vm.requestParams()
        expect(res).toStrictEqual({"page_no": 1, "page_size": 10})
        wrapper.vm.groupCategoryValue = "test"
        res = wrapper.vm.requestParams()
        expect(res).toStrictEqual({"q": "test"})
    })
    it("should test for loader value",()=>{
        expect(wrapper.vm.showLoader).toBe(false)
    })
    it("should check for pageOptionChange",()=>{
        wrapper.vm.pageOptionChange({current:2,limit:10})
        expect(wrapper.vm.pagination).toStrictEqual({"current": 2, "limit": 10, "next_page": false, "total": 1})
    })
    it("should check for handleEditClicked",()=>{
        wrapper.vm.handleEditClicked({name:'test',slug:'slug test',categories:[2741]})
    })
    it("should check for category card component to exists",()=>{
        expect(wrapper.findComponent(CategoryCard).exists()).toBe(false)
    })
    it("should check for handleAddCategories",()=>{
        wrapper.vm.handleAddCategories()
    })
    it("should check for handleChange",()=>{
        wrapper.vm.handleChange("test value")
        sleep(1000).then(()=>{
            expect(wrapper.vm.groupCategoryValue).toBe("test value")
        })
    })
})