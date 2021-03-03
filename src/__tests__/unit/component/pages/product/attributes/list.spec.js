import { mount, createLocalVue } from "@vue/test-utils";
import AttributeComponent from "../../../../../../pages/product/attributes/list.vue";

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';

import URLS from "../../../../../../services/domain.service.js"
import mocks from "./mocks";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)

describe('Mounted List Attributes Page', () => {
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
    it('list - exists wrapper and div', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/attributes', component: AttributeComponent }
            ]
        })
        router.push('/administrator/product/attributes');
        mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
        mock.onGet(URLS.FETCH_ATTRIBUTE()).reply(200, {}).onAny().reply(
            200, mocks.attributeResponse
        );
        mock.onGet(URLS.UNITS()).reply(200, { data: mocks.unitsResponse });
        const wrapper = mount(AttributeComponent, {
            localVue,
            router,
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot()

    })
    it('list - functions verify', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/attributes', component: AttributeComponent }
            ]
        })
        router.push('/administrator/product/attributes');
        mock.onGet(URLS.DEPARTMENT()).reply(200, { items: mocks.departments });
        mock.onGet(URLS.FETCH_ATTRIBUTE()).reply(200, {}).onAny().reply(
            200, mocks.attributeResponse
        );
        mock.onGet(URLS.UNITS()).reply(200, { data: mocks.unitsResponse });
        const wrapper = mount(AttributeComponent, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        wrapper.vm.$set(wrapper.vm, 'attributes', mocks.attributeResponse.data);
        wrapper.vm.$set(wrapper.vm.pagination, 'total', 1);
        expect(wrapper.vm.pageError).toBe(false);
        wrapper.vm.setDepartmentsList({ text: 'elec' });
        expect(wrapper.vm.departmentsList.length).toBe(1);
        wrapper.vm.setDepartmentsList();
        expect(wrapper.vm.departmentsList.length).toBe(3);
        expect(wrapper.vm.getErrorImage()).toBe('/public/admin/assets/pngs/default_icon_listing.png');
        // expect(wrapper.vm.getLine2Txt()).toBe('Type')
        wrapper.vm.$set(wrapper.vm, 'searchText', 'testSearchText');
        wrapper.vm.clearSearchFilter();
        expect(wrapper.vm.searchText).toBe('');
    })
    it('list - redirect verify', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/attributes', component: AttributeComponent }
            ]
        })
        router.push('/administrator/product/attributes');
        mock.onGet(URLS.DEPARTMENT()).reply(200, { items: mocks.departments });
        mock.onGet(URLS.FETCH_ATTRIBUTE()).reply(200, {}).onAny().reply(
            200, mocks.attributeResponse
        );
        mock.onGet(URLS.UNITS()).reply(200, { data: mocks.unitsResponse });
        const wrapper = mount(AttributeComponent, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        wrapper.vm.companyView({ uid: 1 });
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/company-details/1');
        router.push('/administrator/product/attributes');
        wrapper.vm.redirectEdit();
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/attributes/create');
        router.push('/administrator/product/attributes');
        wrapper.vm.redirectEdit('test-slug');
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/attributes/edit/test-slug');
    });
})
