import {mount, createLocalVue} from "@vue/test-utils";
import ListComponent from "../../../../../pages/catalogue/list-variants.vue";
import URLS from  "../../../../../services/domain.service.js"

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';

import mocks from "./mocks";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)

describe('List Department', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.SEARCH_DRI()).reply(200, [
            {"_id":"5f2ba5a8ffb60e372568eaaf","gender":"female","accountType":"user","active":true,"phoneNumbers":[
                {"active":true,"primary":true,"verified":true,"countryCode":91,"phone":"9768080981"}],
                "firstName":"Mithali","lastName":"Kamble","emails":[{"active":true,"primary":true,
                "verified":true,"email":"mithalikamble@gofynd.com"},{"active":true,"primary":false,"verified":true,
                "email":"mithalikamble@fynd.com"},{"active":true,"primary":false,"verified":true,
                "email":"mithalikamble@uniket.store"}],"createdAt":"2020-08-06T06:39:36.189Z",
                "updatedAt":"2020-10-23T10:59:13.521Z","uid":"68"}]);
    });
    it('list - should exist wrapper and div', async() => {
    const router = new VueRouter({routes: [
        { path: '/administrator/product/variants', component: ListComponent }
    ]})
    router.push('/administrator/product/variants');
    mock.onGet(URLS.CATEGORY_v2()).reply(200).onAny().reply(
        200, {data:mocks.variants}
    )
    const wrapper = mount(ListComponent, {
        localVue,
        router,
    })
    // await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(wrapper.exists()).toBeTruthy();
    const div = wrapper.find('div');
    expect(div.exists()).toBe(true);
    expect(wrapper.element).toMatchSnapshot()

    });
    it('list - error response', async() => {
        const router = new VueRouter({routes: [
            { path: '/administrator/product/variants', component: ListComponent }
        ]})
        router.push('/administrator/product/variants');
        mock.onGet(URLS.CATEGORY_v2()).reply(200).onAny().reply(
            500, "error"
        )
    
        const wrapper = mount(ListComponent, {
            localVue,
            router,
        })
        // await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.pageError).toBeTruthy()
    
        });
    it('list - error response', async() => {
        const router = new VueRouter({routes: [
            { path: '/administrator/product/variants', component: ListComponent }
        ]})
        router.push('/administrator/product/variants');
        mock.onGet(URLS.CATEGORY_v2()).reply(200).onAny().reply(
            500, "error"
        )
    
        const wrapper = mount(ListComponent, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.isLoading).toBe(false);
        wrapper.vm.$set(wrapper.vm, 'mainList', mocks.variants)
        wrapper.vm.$set(wrapper.vm, 'variantList', mocks.variants)
        wrapper.vm.$set(wrapper.vm, 'isLoading', false);
        wrapper.vm.$set(wrapper.vm, 'searchText', "Additiona");
        wrapper.vm.searchVariant();
        expect(wrapper.vm.variantList.length).toBe(1)
        wrapper.vm.createVariant();
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/variants/create');
        wrapper.vm.editVariant(mocks.variants[0]);
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/variants/edit/2');
    });
})
