import {mount, createLocalVue} from "@vue/test-utils";
import DeptComponent from "../../../../../pages/catalogue/list-department.vue";
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
    });
    it('list - should exist wrapper and div', async() => {
    const router = new VueRouter({routes: [
        { path: '/administrator/product/department', component: DeptComponent }
    ]})
    router.push('/administrator/product/department');
    mock.onGet(URLS.CATEGORY_v2()).reply(200, {data:mocks.departments}).onAny().reply(
        200, {data:mocks.departments}
    )
    mock.onGet(URLS.SEARCH_DRI()).reply(200, {}).onAny().reply(200, [
        {"_id":"5f2ba5a8ffb60e372568eaaf","gender":"female","accountType":"user","active":true,"phoneNumbers":[
            {"active":true,"primary":true,"verified":true,"countryCode":91,"phone":"9768080981"}],
            "firstName":"Mithali","lastName":"Kamble","emails":[{"active":true,"primary":true,
            "verified":true,"email":"mithalikamble@gofynd.com"},{"active":true,"primary":false,"verified":true,
            "email":"mithalikamble@fynd.com"},{"active":true,"primary":false,"verified":true,
            "email":"mithalikamble@uniket.store"}],"createdAt":"2020-08-06T06:39:36.189Z",
            "updatedAt":"2020-10-23T10:59:13.521Z","uid":"68"}]);

    const wrapper = mount(DeptComponent, {
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
    it('list - should validate functions', async() => {
        const router = new VueRouter({routes: [
            { path: '/administrator/product/department', component: DeptComponent }
        ]})
        router.push('/administrator/product/department');
        mock.onGet(URLS.CATEGORY_v2()).reply(200, {data:mocks.departments}).onAny().reply(
            500, "error")
    
        const wrapper = mount(DeptComponent, {
            localVue,
            router,
        })
        // await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.isLoading).toBe(false)
        wrapper.vm.$set(wrapper.vm, 'departmentList', mocks.departments )
        wrapper.vm.$set(wrapper.vm.pagination,'total', 1 )
        expect(wrapper.vm.getDepartmentImage({})).toBe('/public/assets/pngs/product_image_placeholder.png')
        wrapper.vm.getErrorImage(wrapper.vm.departmentList[0])
        expect(wrapper.vm.departmentList[0].logo).toBe('/public/assets/pngs/product_image_placeholder.png')
        wrapper.vm.createDepartment()
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/department/create')
        wrapper.vm.editDepartment(wrapper.vm.departmentList[0]);
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/department/edit/1')
        });
    it('list - error in received data', async() => {
        const router = new VueRouter({routes: [
            { path: '/administrator/product/department', component: DeptComponent }
        ]})
        router.push('/administrator/product/department');
        mock.onGet(URLS.CATEGORY_v2()).reply(200, {data:mocks.departments}).onAny().reply(
            500, "error")
    
        const wrapper = mount(DeptComponent, {
            localVue,
            router,
        })
        // await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.pageError).toBeTruthy()
    
        });
})
