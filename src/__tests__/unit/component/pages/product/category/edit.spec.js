import { mount, shallowMount, config, createLocalVue } from "@vue/test-utils";
import EditCategory from "../../../../../../pages/product/category/edit.vue";
import URLS from "../../../../../../services/domain.service.js"

import mocks from "./mocks";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';

const mock = new MockAdapter(axios);

let localVue = createLocalVue()
localVue.use(VueRouter)

describe('Mounted Create/Edit Category Page', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    });
    it('should render to a snapshot', () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/category/create', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category/create');
        const wrapper = mount(EditCategory, {
            localVue,
            router
        })
        expect(wrapper.element).toMatchSnapshot();
    });
    it('create - has departments data', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/category/create', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category/create');
        mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
        const wrapper = mount(EditCategory, {
            localVue,
            router,
        })
        // await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.getDepartmentName(1)).toBe('Electronics')
        expect(wrapper.vm.departments.length).toBe(1)
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('create - ', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/category/create', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category/create');
        mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
        const wrapper = mount(EditCategory, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        wrapper.vm.save()
        expect(wrapper.vm.name.showerror).toBe(true)
    })
    it('edit - should render to a snapshot', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/category/edit/:id', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category/edit/1');
        mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
        mock.onGet(URLS.CATEGORY_v2() + "/1").reply(200, { data: [mocks.categoryList[0]] });
        mock.onGet(URLS.CATEGORY_v2 + "?level=1&level=2&page_size=500&department=1").reply(
            200, { data: [mocks.categoryList[1], mocks.categoryList[2]] })
        const wrapper = mount(EditCategory, {
            localVue,
            router
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        wrapper.vm.save();
        expect(wrapper.vm.name.showerror).toBe(false)
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.vm.isEdit).toBe(true);
    });
    it('edit - verify functions', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/category/edit/:id', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category/edit/1');
        mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
        mock.onGet(URLS.CATEGORY_v2() + "/1").reply(200, { data: [mocks.categoryList[0]] });
        mock.onGet(URLS.CATEGORY_v2 + "?level=1&level=2&page_size=500&department=1").reply(
            200, { data: [mocks.categoryList[1], mocks.categoryList[2]] })
        const wrapper = mount(EditCategory, {
            localVue,
            router
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        const wrapperInstance = wrapper.vm;
        wrapperInstance.save();
        expect(wrapperInstance.getItems(1, 2)).toEqual([]);
        wrapperInstance.$set(wrapperInstance.marketplaces.subvalues.google, 'catalog_id', 12);
        wrapperInstance.$set(wrapperInstance.marketplaces.subvalues.google, 'name', 'testName');
        wrapperInstance.deleteMarketplace();
        expect(wrapperInstance.marketplaces.subvalues.google.name).toBe('')
        wrapperInstance.redirectToListing();
        wrapperInstance.searchDepartment();
        expect(wrapperInstance.$route.fullPath).toBe("/administrator/product/category")
        wrapperInstance.$set(wrapperInstance.synonym.value, 0, "test");
        wrapperInstance.removeSearchInput(0)
        expect(wrapperInstance.synonym.value).toEqual([])
        wrapperInstance.$set(wrapperInstance, 'synonymText', "text1,text2");
        wrapperInstance.addSearchText()
        expect(wrapperInstance.synonym.value).toEqual(["text1", "text2"])
        wrapperInstance.removeItem(0, { value: wrapper.vm.selectedDepartments[0] })
        expect(wrapperInstance.selectedDepartments.value.length).toBe(0)
        wrapperInstance.updateMapping([])
        expect(wrapperInstance.selectedDepartments).toBeTruthy();

    });
    it('edit - no category data', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/category/edit/:id', component: EditCategory }
            ]
        })
        router.push('/administrator/product/category/edit/1');
        mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
        mock.onGet(URLS.CATEGORY_v2() + "/1").reply(200, { data: [{}] });
        mock.onGet(URLS.CATEGORY_v2 + "?level=1&level=2&page_size=500&department=1").reply(
            200, { data: [mocks.categoryList[1], mocks.categoryList[2]] })
        const wrapper = mount(EditCategory, {
            localVue,
            router
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        const wrapperInstance = wrapper.vm;
        wrapperInstance.searchLevel("", 1, [])
        expect(wrapperInstance.level.value).toBe('');
        expect(wrapperInstance.name.value).toBe('');


    })
})
