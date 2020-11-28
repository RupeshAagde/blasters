import { mount, createLocalVue } from "@vue/test-utils";
import CompanyComponent from "../../../../../pages/company-admin/company-list.vue";
import URLS from "../../../../../services/domain.service.js"

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';

import mocks from "./mocks";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)

describe('List Company List Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.SEARCH_DRI()).reply(200, [
            {
                "_id": "5f2ba5a8ffb60e372568eaaf", "gender": "female", "accountType": "user", "active": true, "phoneNumbers": [
                    { "active": true, "primary": true, "verified": true, "countryCode": 91, "phone": "9768080981" }],
                "firstName": "Mithali", "lastName": "Kamble", "emails": [{
                    "active": true, "primary": true,
                    "verified": true, "email": "mithalikamble@gofynd.com"
                }, {
                    "active": true, "primary": false, "verified": true,
                    "email": "mithalikamble@fynd.com"
                }, {
                    "active": true, "primary": false, "verified": true,
                    "email": "mithalikamble@uniket.store"
                }], "createdAt": "2020-08-06T06:39:36.189Z",
                "updatedAt": "2020-10-23T10:59:13.521Z", "uid": "68"
            }]);
    });
    it('list - should exist wrapper and div', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/company-list', component: CompanyComponent }
            ]
        })
        router.push('/administrator/company-list');
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, { data: mocks.companyResponse });


        const wrapper = mount(CompanyComponent, {
            localVue,
            router,
        });
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.pageError).toBe(false);
    })
    it('list - error response', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/company-list', component: CompanyComponent }
            ]
        })
        router.push('/administrator/company-list');
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(500, { data: { error: "failed" } });
        const wrapper = mount(CompanyComponent, {
            localVue,
            router,
        });
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.pageError).toBe(true);
    })
    it('list - functions verify', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/company-list', component: CompanyComponent }
            ]
        })
        router.push('/administrator/company-list');
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, { data: mocks.companyResponse });

        const wrapper = mount(CompanyComponent, {
            localVue,
            router,
        });
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.pageError).toBe(false);
        wrapper.vm.$set(wrapper.vm, 'searchText', 'test');
        wrapper.vm.clearSearchFilter();
        expect(wrapper.vm.searchText).toBe('');
        expect(wrapper.vm.getErrorImage()).toBe('/public/admin/assets/pngs/default_icon_listing.png');
        wrapper.vm.companyView({ uid: 1 });
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/company-details/1')
    })
    it('list - search Dri throws error', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/company-list', component: CompanyComponent }
            ]
        })
        router.push('/administrator/company-list');
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, { data: mocks.companyResponse });
        mock.onGet(URLS.SEARCH_DRI()).reply(500, { error: "failed" });

        const wrapper = mount(CompanyComponent, {
            localVue,
            router,
        });
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.pageError).toBe(false);
        expect(wrapper.vm.companyList.length).toBe(0);
    })
})