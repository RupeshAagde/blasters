import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import RmaSetup from '../../../../../pages/rma/rma-setup.vue';
import ProductReturnQc from '../../../../../pages/rma/product-return-qc.vue';
import {
    NitrozenToggleBtn,
    NitrozenInput,
    NitrozenRadio,
    NitrozenDropdown,
    NitrozenButton
} from '@gofynd/nitrozen-vue';
import URLS from '../../../../../services/domain.service.js';

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';

import salesChannelMock from './fixtures/get-sales-channels-mock-data.json';
import reasonsMock from './fixtures/reasons-mock.json';
import questionsMock from './fixtures/questions-mock.json';
import lMock from './fixtures/l1-mock.json'

const mock = new MockAdapter(axios);
let localVue = createLocalVue();
localVue.use(VueRouter);
let wrapper, router;

describe('Mounted RMA Setup Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.GET_RMA_SALES_CHANNEL()).reply(200, salesChannelMock);
        mock.onGet(URLS.GET_REASONS()).reply(200, reasonsMock);
        mock.onGet(URLS.GET_QUESTIONS()).reply(200, questionsMock);
    });
    it('list - should exist wrapper and div', async () => {
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/rma/rules/:company/setup',
                    component: RmaSetup
                }
            ]
        });
        router.push('/administrator/rma/rules/:company/setup');

        wrapper = mount(RmaSetup, {
            localVue,
            router
        });
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapper.exists()).toBeTruthy();
        const container = wrapper.find('.panel');
        expect(container.exists()).toBe(true);
        expect(wrapper.element).toMatchSnapshot();
    });

    it('contains ProductReturnQc component', async () => {
        const productReturnQC = wrapper.findComponent(ProductReturnQc);
        expect(productReturnQC.exists()).toBe(true);
    });

    it('contains sales channel dropdown', async () => {
        let salesChannelDropdown = wrapper.findAllComponents(NitrozenDropdown)
        salesChannelDropdown = salesChannelDropdown.at(1)
        salesChannelDropdown.vm.$emit("searchInputChange", {text: "test"});
        expect(wrapper.vm.salesChannelSearchText).toBe("test");
    });

    it('select sales channel dropdown', async () => {
        let salesChannelDropdown = wrapper.findAllComponents(NitrozenDropdown)
        salesChannelDropdown = salesChannelDropdown.at(1)
        salesChannelDropdown.vm.$emit("input", "ECOMM");
        salesChannelDropdown.vm.$emit("change");
        expect(wrapper.vm.selectedSalesChannel).toBe("ECOMM");
    });

    it('scrolls sales channel dropdown', async () => {
        let apiFn = jest.spyOn(wrapper.vm, "fetchSalesChannelsList");
        let salesChannelDropdown = wrapper.findAllComponents(NitrozenDropdown);
        salesChannelDropdown = salesChannelDropdown.at(1);
        salesChannelDropdown.vm.$emit("scroll", {scrollTop: 0, scrollHeight: 200});
        expect(apiFn).toHaveBeenCalled();
    });

    it('contains department dropdown', async () => {
        let departmentDropdown = wrapper.findAllComponents(NitrozenDropdown)
        departmentDropdown = departmentDropdown.at(2)
        departmentDropdown.vm.$emit("searchInputChange", {text: "test"});
        expect(wrapper.vm.departmentSearchText).toBe("test");
    });

    it('select department dropdown', async () => {
        let apiFn = jest.spyOn(wrapper.vm, "getCategoryTypes");
        let departmentDropdown = wrapper.findAllComponents(NitrozenDropdown)
        departmentDropdown = departmentDropdown.at(2)
        departmentDropdown.vm.$emit("input", "ECOMM");
        departmentDropdown.vm.$emit("change");
        expect(wrapper.vm.selectedDepartment).toBe("ECOMM");
        await new Promise(resolve=>setTimeout(resolve, 600));
        await wrapper.vm.$nextTick();
        await flushPromises();
        wrapper.vm.getCategoryTypes()
        mock.onGet(URLS.GET_CATEGORIES()).reply(200, lMock);
        expect(apiFn).toHaveBeenCalled()
    });

    it('contains l1 dropdown', async () => {
        let l1Dropdown = wrapper.findAllComponents(NitrozenDropdown)
        l1Dropdown = l1Dropdown.at(3)
        l1Dropdown.vm.$emit("searchInputChange", {text: "test"});
        expect(wrapper.vm.l1SearchText).toBe("test");
    });

    it('select l1 dropdown', async () => {
        let apiFn = jest.spyOn(wrapper.vm, "getCategoryTypes");
        let l1Dropdown = wrapper.findAllComponents(NitrozenDropdown)
        l1Dropdown = l1Dropdown.at(3)
        l1Dropdown.vm.$emit("input", "ECOMM");
        l1Dropdown.vm.$emit("change");
        expect(wrapper.vm.selectedL1).toBe("ECOMM");
        await new Promise(resolve=>setTimeout(resolve, 600));
        await wrapper.vm.$nextTick();
        await flushPromises();
        wrapper.vm.getCategoryTypes('l2')
        mock.onGet(URLS.GET_CATEGORIES()).reply(200, lMock);
        expect(apiFn).toHaveBeenCalled()
    });

    it('contains l2 dropdown', async () => {
        let l2Dropdown = wrapper.findAllComponents(NitrozenDropdown)
        l2Dropdown = l2Dropdown.at(4)
        l2Dropdown.vm.$emit("searchInputChange", {text: "test"});
        expect(wrapper.vm.l2SearchText).toBe("test");
    });

    it('select l2 dropdown', async () => {
        let apiFn = jest.spyOn(wrapper.vm, "getCategoryTypes");
        let l2Dropdown = wrapper.findAllComponents(NitrozenDropdown)
        l2Dropdown = l2Dropdown.at(4)
        l2Dropdown.vm.$emit("input", "ECOMM");
        l2Dropdown.vm.$emit("change");
        expect(wrapper.vm.selectedL2).toBe("ECOMM");
        await new Promise(resolve=>setTimeout(resolve, 600));
        await wrapper.vm.$nextTick();
        await flushPromises();
        wrapper.vm.getCategoryTypes('l3')
        mock.onGet(URLS.GET_CATEGORIES()).reply(200, lMock);
        expect(apiFn).toHaveBeenCalled()
    });

    it('contains l3 dropdown', async () => {
        let l3Dropdown = wrapper.findAllComponents(NitrozenDropdown)
        l3Dropdown = l3Dropdown.at(5)
        l3Dropdown.vm.$emit("searchInputChange", {text: "test"});
        expect(wrapper.vm.l3SearchText).toBe("test");
    });

    it('select l3 dropdown', () => {
        let l3Dropdown = wrapper.findAllComponents(NitrozenDropdown)
        l3Dropdown = l3Dropdown.at(5)
        l3Dropdown.vm.$emit("input", "ECOMM");
        l3Dropdown.vm.$emit("change");
        expect(wrapper.vm.selectedL3).toBe("ECOMM");
    });

    it('contains toggle button', async () => {
        let toggleButton = wrapper.findAllComponents(NitrozenToggleBtn)
        toggleButton = toggleButton.at(0)
        toggleButton.vm.$emit("change");
        await new Promise(resolve=>setTimeout(resolve, 600));
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(wrapper.vm.qc_active).toBe(true);
    });



    // it('list - should validate functions', async () => {
    //     const router = new VueRouter({
    //         routes: [
    //             { path: '/administrator/product/department', component: RmaSetup }
    //         ]
    //     })
    //     router.push('/administrator/product/department');
    //     mock.onGet(URLS.CATEGORY_v2()).reply(200, { data: mocks.departments }).onAny().reply(
    //         500, "error")

    //     const wrapper = mount(RmaSetup, {
    //         localVue,
    //         router,
    //     })
    //     // await wrapper.vm.$nextTick();
    //     await new Promise(resolve => setTimeout(resolve, 10));
    //     expect(wrapper.vm.isLoading).toBe(false)
    //     wrapper.vm.$set(wrapper.vm, 'departmentList', mocks.departments)
    //     wrapper.vm.$set(wrapper.vm.pagination, 'total', 1)
    //     expect(wrapper.vm.getDepartmentImage({})).toBe('/public/assets/pngs/product_image_placeholder.png')
    //     wrapper.vm.getErrorImage(wrapper.vm.departmentList[0])
    //     expect(wrapper.vm.departmentList[0].logo).toBe('/public/assets/pngs/product_image_placeholder.png')
    //     wrapper.vm.createDepartment()
    //     expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/department/create')
    //     wrapper.vm.editDepartment(wrapper.vm.departmentList[0]);
    //     expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/department/edit/1')
    // });
    // it('list - error in received data', async () => {
    //     const router = new VueRouter({
    //         routes: [
    //             { path: '/administrator/product/department', component: RmaSetup }
    //         ]
    //     })
    //     router.push('/administrator/product/department');
    //     mock.onGet(URLS.CATEGORY_v2()).reply(200, { data: mocks.departments }).onAny().reply(
    //         500, "error")

    //     const wrapper = mount(RmaSetup, {
    //         localVue,
    //         router,
    //     })
    //     // await wrapper.vm.$nextTick();
    //     await new Promise(resolve => setTimeout(resolve, 10));
    //     expect(wrapper.vm.pageError).toBeTruthy()

    // });
});
