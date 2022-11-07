import { mount, createLocalVue } from "@vue/test-utils";
import ListComponent from "@/pages/product/variants/list.vue";
import { NitrozenDropdown } from "@gofynd/nitrozen-vue";

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import Vuex from 'vuex';
import { FETCH_VARIANTS, FETCH_TEMPLATES } from '@/store/action.type.js';
import flushPromises from "flush-promises";

import mocks from "./mocks";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex);
let store = new Vuex.Store({
    modules: {
        variants: {
            state: {},
            dispatch: jest.fn(),
            actions: {
                async [FETCH_VARIANTS]() {
                    return mocks.variants;
                },
                async [FETCH_TEMPLATES]() {
                    return mocks.templates;
                }
            }
        }
    }
});

describe('Should mount variant list component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

    });
    it('list - should exist wrapper and div', async () => {
        let router = new VueRouter({
            routes: [
                { path: '/administrator/product/variants', component: ListComponent }
            ]
        })
        router.push('/administrator/product/variants');
        const wrapper = mount(ListComponent, {
            localVue,
            store,
            router,
        })
        await flushPromises();

        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.element).toMatchSnapshot()

    });
    it('list - should call various defined methods', async () => {
        let router = new VueRouter({
            routes: [
                { path: '/administrator/product/variants', component: ListComponent }
            ]
        })
        router.push('/administrator/product/variants');
        const wrapper = mount(ListComponent, {
            localVue,
            store,
            router,
        })
        await flushPromises();

        //create method
        let element = wrapper.find('#create-btn');
        element.vm.$emit('click');

        //edit method
        let element2 = wrapper.find('.list-container');
        if (element2) {
            expect(element2.exists()).toBe(true)
            element2.trigger('click');
        } else {
            expect(element2.exists()).toBe(true)
        }
        // search variant
        let element3 = wrapper.find('.search');
        element3.vm.$emit('input', 'test');
        await new Promise(resolve => setTimeout(resolve, 500));

        //template search with input
        let dropdowns = wrapper.findAllComponents(NitrozenDropdown);
        dropdowns = dropdowns.at(0);
        dropdowns.vm.$emit("searchInputChange", { text: "Bottomwear" });
        await new Promise(resolve => setTimeout(resolve, 600));
    });
    it('list - should throw error if api does not get desired value', async () => {
        const store = new Vuex.Store({
            modules: {
                variants: {
                    state: {},
                    dispatch: jest.fn(),
                    actions: {
                        async [FETCH_VARIANTS]() {
                            return mocks.error;
                        },
                        async [FETCH_TEMPLATES]() {
                            return mocks.error;
                        }
                    }
                }
            }
        });
        let router = new VueRouter({
            routes: [
                { path: '/administrator/product/variants', component: ListComponent }
            ]
        })
        router.push('/administrator/product/variants');
        const wrapper = mount(ListComponent, {
            localVue,
            store,
            router,
        })
        await flushPromises();

    })
})
