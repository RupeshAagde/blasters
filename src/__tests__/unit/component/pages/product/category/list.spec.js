import { mount, createLocalVue } from "@vue/test-utils";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';

import EditCategory from "../../../../../../pages/product/category/list.vue";
import URLS from "../../../../../../services/domain.service.js"
import mocks from "./mocks";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)

describe('List Category Page', () => {
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
                { path: '/administrator/product/category', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category');
        mock.onGet(URLS.CATEGORY_v2()).reply(200, { data: mocks.categoryList });
        mock.onGet("/auth/user-info/search/").reply(200, {});

        const wrapper = mount(EditCategory, {
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
    it('list - pagination verify', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/category', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category');
        mock.onGet(URLS.CATEGORY_v2()).reply(200, { data: mocks.categoryList });
        mock.onGet("/auth/user-info/search/").reply(200, {});

        const wrapper = mount(EditCategory, {
            localVue,
            router,
        })
        wrapper.vm.getCategory(true);
        expect(wrapper.vm.pagination.current).toBe(1)

    });
    it('list - functions verify', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/category', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category');
        mock.onGet(URLS.CATEGORY_v2()).reply(200, { data: mocks.categoryList });
        mock.onGet("/auth/user-info/search/").reply(200, {});

        const wrapper = mount(EditCategory, {
            localVue,
            router,
        })
        wrapper.vm.editCategory({ uid: 1 });
        expect(wrapper.vm.$route.fullPath).toBe("/administrator/product/category/edit/1")
        wrapper.vm.createDepartment();
        expect(wrapper.vm.$route.fullPath).toBe("/administrator/product/category/create")
    });
    it('list - default image verify', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/category', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category');
        mock.onGet(URLS.CATEGORY_v2()).reply(200, { data: mocks.categoryList });
        mock.onGet("/auth/user-info/search/").reply(200, {});

        const wrapper = mount(EditCategory, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.getCategoryImage({ media: {} })).toBe("/public/assets/pngs/product_image_placeholder.png");
    });
})
