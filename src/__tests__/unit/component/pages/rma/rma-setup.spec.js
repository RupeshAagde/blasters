import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import RmaSetup from '../../../../../pages/rma/rma-setup.vue';
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenRadio
} from '@gofynd/nitrozen-vue';
import URLS from '../../../../../services/domain.service.js';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import salesChannelMock from './fixtures/get-sales-channels-mock-data.json';
import reasonsMock from './fixtures/reasons-mock.json';
import questionsMock from './fixtures/questions-mock.json';
import editRuleDataMock from './fixtures/mockEditRuleData.json';

const mock = new MockAdapter(axios);
let localVue,
    router,
    wrapperGlobalSetup,
    wrapperGlobalEdit,
    wrapperCustomEdit;

let destroyComponent = jest.fn();
let init = jest.fn();

describe('RMA Global Setup Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/rma/rules/global/setup',
                    name: 'rma-global-rule-setup',
                    component: RmaSetup
                }
            ]
        });
        mock.reset();
        mock.onGet(URLS.GET_OPTED_RMA_SALES_CHANNEL()).reply(
            200,
            salesChannelMock
        );
        mock.onGet(URLS.GET_REASONS()).reply(200, reasonsMock);
        mock.onGet(URLS.GET_QUESTIONS()).reply(200, questionsMock);
    });

    it('mount global setup page', async () => {
        router.push('/administrator/rma/rules/global/setup');

        wrapperGlobalSetup = mount(RmaSetup, {
            localVue,
            router
        });

        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapperGlobalSetup.exists()).toBeTruthy();
        const container = wrapperGlobalSetup.find('.panel');
        expect(container.exists()).toBe(true);
    });

    it('should render to a snapshot', () => {
        expect(wrapperGlobalSetup.element).toMatchSnapshot();
    });

    it('search department dropdown', async () => {
        let departmentDropdown = wrapperGlobalSetup.findAllComponents(
            NitrozenDropdown
        );
        departmentDropdown = departmentDropdown.at(0);
        departmentDropdown.vm.$emit('searchInputChange', { text: 'test' });
        expect(wrapperGlobalSetup.vm.selectedL3).toBe(null);
    });

    it('select department dropdown', async () => {
        let departmentDropdown = wrapperGlobalSetup.findAllComponents(
            NitrozenDropdown
        );
        departmentDropdown = departmentDropdown.at(0);
        departmentDropdown.vm.$emit('input', 'ECOMM');
        departmentDropdown.vm.$emit('change');
        expect(wrapperGlobalSetup.vm.selectedDepartment).toBe('ECOMM');
    });

    it('search L3 dropdown', async () => {
        let L3Dropdown = wrapperGlobalSetup.findAllComponents(NitrozenDropdown);
        L3Dropdown = L3Dropdown.at(1);
        L3Dropdown.vm.$emit('searchInputChange', { text: '' });
        expect(wrapperGlobalSetup.vm.selectedL3).toBe(null);
    });

    it('select L3 dropdown', async () => {
        let L3Dropdown = wrapperGlobalSetup.findAllComponents(NitrozenDropdown);
        L3Dropdown = L3Dropdown.at(1);
        L3Dropdown.vm.$emit('input', 'ECOMM');
        L3Dropdown.vm.$emit('change');
        expect(wrapperGlobalSetup.vm.selectedDepartment).toBe('ECOMM');
    });

    it('search Reasons dropdown', async () => {
        let reasonsDropdown = wrapperGlobalSetup.findAllComponents(
            NitrozenDropdown
        );
        reasonsDropdown = reasonsDropdown.at(2);
        reasonsDropdown.vm.$emit('searchInputChange', { text: 'test' });
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalSetup.vm.$nextTick();
        await flushPromises();
        expect(wrapperGlobalSetup.vm.parentReasonsDropdownSearchText).toBe(
            'test'
        );
    });

    it('select Reasons dropdown', async () => {
        let reasonsDropdown = wrapperGlobalSetup.findAllComponents(
            NitrozenDropdown
        );
        reasonsDropdown = reasonsDropdown.at(2);
        reasonsDropdown.vm.$emit('input', 'ECOMM');
        reasonsDropdown.vm.$emit('change');
        expect(wrapperGlobalSetup.vm.selectedParentReason).toBe('ECOMM');
    });
});

describe('RMA Global Edit Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/rma/rules/global/edit',
                    name: 'rma-global-rule-edit',
                    component: RmaSetup
                }
            ]
        });
        mock.reset();
        mock.onGet(URLS.GET_OPTED_RMA_SALES_CHANNEL()).reply(
            200,
            salesChannelMock
        );
        mock.onGet(URLS.GET_REASONS()).reply(200, reasonsMock);
        mock.onGet(URLS.GET_QUESTIONS()).reply(200, questionsMock);
    });

    it('mount global edit page', async () => {
        router.push('/administrator/rma/rules/global/edit');
        const getItem = jest
            .spyOn(Storage.prototype, 'getItem')
            .mockReturnValue(JSON.stringify(editRuleDataMock));

        wrapperGlobalEdit = mount(RmaSetup, {
            localVue,
            router,
            data() {
                return {
                    editRuleData: undefined,
                    chosenParentReasonsList: [],
                    parentReasonsDropdownList: [],
                    childReasonsDropdownList: [],
                    selectedArrayOfReasons: {}
                };
            },
            destroyed() {
                destroyComponent();
            },
            mounted() {
                init();
            }
        });

        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapperGlobalEdit.exists()).toBeTruthy();
        const container = wrapperGlobalEdit.find('.panel');
        expect(container.exists()).toBe(true);
        expect(wrapperGlobalEdit.element).toMatchSnapshot();
        expect(init).toHaveBeenCalled();
    });

    it('test toggle parent reason', async () => {
        let collapseButton = wrapperGlobalEdit.findAll('.collapse-button');
        collapseButton = collapseButton.at(0);
        await collapseButton.trigger('click');
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalEdit.vm.$nextTick();
        await flushPromises();
        const container = wrapperGlobalEdit.find('.reason-content-wrapper');
        expect(container.exists()).toBe(true);
        expect(wrapperGlobalEdit.vm.chosenParentReasonsList[0].collapse).toBe(
            true
        );
        expect(
            wrapperGlobalEdit.vm.chosenParentReasonsList[0].reasons[0].storedVal.includes(
                'default'
            )
        ).toBe(false);
        wrapperGlobalEdit.setData({
            selectedArrayOfReasons: {
                '7-|-Size not available-|-true': [
                    { storedVal: '7-|-Size not available-|-true' },
                    { storedVal: '6-|-Product out of stock-|-true' }
                ]
            }
        });
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalEdit.vm.$nextTick();
        await flushPromises();
    });

    it('delete parent reason', async () => {
        let deleteButton = wrapperGlobalEdit.findAll('.collapse-button');
        deleteButton = deleteButton.at(1);
        await deleteButton.trigger('click');
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalEdit.vm.$nextTick();
        await flushPromises();
        expect(wrapperGlobalEdit.vm.chosenParentReasonsList.length).toBe(1);
    });

    it('delete sub reason', async () => {
        let collapseButton = wrapperGlobalEdit.findAll('.collapse-button');
        collapseButton = collapseButton.at(0);
        await collapseButton.trigger('click');
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalEdit.vm.$nextTick();
        await flushPromises();
        wrapperGlobalEdit.setData({
            selectedArrayOfReasons: {
                '7-|-Size not available-|-true': [
                    { storedVal: '7-|-Size not available-|-true' },
                    { storedVal: '6-|-Product out of stock-|-true' }
                ]
            }
        });
        let handleFn = jest.spyOn(
            wrapperGlobalEdit.vm,
            'handleChildReasonsDropdown'
        );
        let childDropdown = wrapperGlobalEdit.findAllComponents(
            NitrozenDropdown
        );
        childDropdown = childDropdown.at(3);
        childDropdown.vm.$emit('input', 'ECOMM');
        childDropdown.vm.$emit('change');
        expect(handleFn).toHaveBeenCalled();
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalEdit.vm.$nextTick();
        await flushPromises();
        let addFn = jest.spyOn(wrapperGlobalEdit.vm, 'addSubReason');
        let addButton = wrapperGlobalEdit.find('.add-rule-option');
        await addButton.trigger('click');
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalEdit.vm.$nextTick();
        await flushPromises();
        expect(addFn).toHaveBeenCalled();
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalEdit.vm.$nextTick();
        await flushPromises();
        let noQcFn = jest.spyOn(wrapperGlobalEdit.vm, 'handleNoQC');
        let radioBtn = wrapperGlobalEdit.findAllComponents(NitrozenRadio);
        radioBtn = radioBtn.at(2);
        await radioBtn.vm.$emit('change');
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalEdit.vm.$nextTick();
        await flushPromises();
        expect(noQcFn).toHaveBeenCalled();
        let deleteFn = jest.spyOn(wrapperGlobalEdit.vm, 'deleteSubReason');
        let deleteButton = wrapperGlobalEdit.findAll('.collapse-button');
        deleteButton = deleteButton.at(2);
        await deleteButton.trigger('click');
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapperGlobalEdit.vm.$nextTick();
        await flushPromises();
        expect(deleteFn).toHaveBeenCalled();
        console.log(wrapperGlobalEdit.vm.selectedArrayOfReasons)
    });

    it('test onDestroy', async () => {
        wrapperGlobalEdit.destroy();
        expect(destroyComponent).toHaveBeenCalled();
    });
});

describe('RMA Custom Edit Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/rma/rules/custom/FyndStore/edit',
                    name: 'rma-custom-rule-edit',
                    component: RmaSetup
                }
            ]
        });
        mock.reset();
        mock.onGet(URLS.GET_OPTED_RMA_SALES_CHANNEL()).reply(
            200,
            salesChannelMock
        );
        mock.onGet(URLS.GET_REASONS()).reply(200, reasonsMock);
        mock.onGet(URLS.GET_QUESTIONS()).reply(200, questionsMock);
    });

    it('mount custom edit page', async () => {
        router.push('/administrator/rma/rules/custom/FyndStore/edit');
        const getItem = jest
            .spyOn(Storage.prototype, 'getItem')
            .mockReturnValue(JSON.stringify(editRuleDataMock));

        wrapperCustomEdit = mount(RmaSetup, {
            localVue,
            router,
            data() {
                return {
                    editRuleData: undefined,
                    chosenParentReasonsList: [],
                    parentReasonsDropdownList: [],
                    childReasonsDropdownList: [],
                    selectedArrayOfReasons: {}
                };
            },
            destroyed() {
                destroyComponent();
            },
            mounted() {
                init();
            }
        });

        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapperCustomEdit.exists()).toBeTruthy();
        const container = wrapperCustomEdit.find('.panel');
        expect(container.exists()).toBe(true);
        expect(wrapperCustomEdit.element).toMatchSnapshot();
        expect(init).toHaveBeenCalled();
    });

    it('saveRule', async () => {
        let saveBtn = wrapperCustomEdit.findComponent(NitrozenButton);
        let saveFn = jest.spyOn(wrapperCustomEdit.vm, 'saveRule');
        await saveBtn.vm.$emit('click');
        expect(saveFn).toHaveBeenCalled();
    });
});
