import { mount, createLocalVue } from "@vue/test-utils";
import EditComponent from "@/pages/product/variants/edit.vue";
import { NitrozenDropdown, NitrozenInline } from "@gofynd/nitrozen-vue";
import PageHeader from '@/components/common/layout/page-header';
import RadioGroup from '@/components/common/radio-group.vue';

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import Vuex from 'vuex';
import { FETCH_VARIANTS, FETCH_TEMPLATES, FETCH_VARIANT_DISPLAY_TYPE, FETCH_ATTRIBUTES, CREATE_EDIT_VARIANTS } from '@/store/action.type.js';
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
                    return mocks.singleVariant;
                },
                async [FETCH_TEMPLATES]() {
                    return mocks.templates;
                },
                async [FETCH_VARIANT_DISPLAY_TYPE]() {
                    return mocks.variantDisplayTypes
                },
                async [FETCH_ATTRIBUTES]() {
                    return mocks.attributeList
                },
                async [CREATE_EDIT_VARIANTS]() {
                    return mocks.singleVariant
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
    it('edit- should exists wrapper and div', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/variants/edit/:uid', component: EditComponent }
            ]
        })
        router.push('/administrator/product/variants/edit/27');

        const wrapper = mount(EditComponent, {
            localVue,
            store,
            router,
        })
        await flushPromises();

        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.element).toMatchSnapshot()

    })

    it('edit- should redirect to listing page', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/variants/edit/:uid', component: EditComponent }
            ]
        })
        router.push('/administrator/product/variants/edit/27');

        const wrapper = mount(EditComponent, {
            localVue,
            store,
            router,
        })
        await flushPromises();

        //saveBtn
        let pgHdr = wrapper.findComponent(PageHeader)
        pgHdr.vm.$emit('backClick');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(wrapper.vm.$router.currentRoute.fullPath).toBe(`/administrator/product/variants`);

    })
    it('edit- should save the edited variant', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/variants/edit/:uid', component: EditComponent }
            ]
        })
        router.push('/administrator/product/variants/edit/27');

        const wrapper = mount(EditComponent, {
            localVue,
            store,
            router,
        })
        await flushPromises();

        //redirectBtn
        let saveBtn = wrapper.find('.left-space-txb')
        saveBtn.vm.$emit('click');
        await new Promise(resolve => setTimeout(resolve, 550));

    })

    it('edit- should check other defined methods', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/variants/edit/:uid', component: EditComponent }
            ]
        })
        router.push('/administrator/product/variants/edit/27');

        const wrapper = mount(EditComponent, {
            localVue,
            store,
            router,
        })
        await flushPromises();

        //remove template
        let removeTemplate = wrapper.findComponent(NitrozenInline)
        removeTemplate.vm.$emit('click', 0);

        //radio group 
        let radioGroup = wrapper.findComponent(RadioGroup)
        radioGroup.vm.$emit('on-change', true);

        //remove template
        let dropdowns = wrapper.findAllComponents(NitrozenDropdown);
        dropdowns = dropdowns.at(0);
        dropdowns.vm.$emit("searchInputChange", { text: "Bottomwear" });
        await new Promise(resolve => setTimeout(resolve, 500));

    })
})