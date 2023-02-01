'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ReconFilters from '../../../../../pages/finance/recon-filters.vue';
import MOCK_DATA from '../company-admin/fixtures/cbs-mock.json';
//import APPLICATION_LIST_MOCK_DATA from './../../../../fixtures/application-list.json';
import mocks from './fixtures/reports.json'
import reconData from './fixtures/recon.json'
//import Vuex from 'vuex';
//import ADMIN_URLS from '@/services/admin/admin-url.service';

let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '1';
const pageSize = 10;

/* const RoleModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
} */
describe('ReconFilters', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        wrapper = mount(ReconFilters, {
            localVue,
            propsData: {
                pageSize: 1,
                statusValueProp: [],
                sellerValueProp: [],
                financeDateProp: '',
                companyChipsProp: []
            }
            /* computed: {
                companyApplications: () => APPLICATION_LIST_MOCK_DATA.items,
            } */
        });
        mock.onGet(DOMAIN_URLS.COMPANY_PROFILE({uid:1})).reply(
            200,
            MOCK_DATA.profileDetails.profile
        );
        mock.onPost(DOMAIN_URLS.GET_CHANNEL()).reply(200, mocks.channelDetails);
        await flushPromises();
    });

    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('should call function when seller name is selected', async () => {

        const clickEvent = jest.spyOn(wrapper.vm, 'setCompanyList');

        await flushPromises();
        wrapper.setData({
            sellerNames: reconData.sellerNames,
            selectedSeller:['790'],
            companyChips: ['790'],
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const copyClick = wrapper.findComponent({ref: 'report-type'});
        copyClick.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalledTimes(1);

    });

    it('should remove the chips on click', async() => {
        await flushPromises();
        wrapper.setData({
            sellerNames: reconData.sellerNames,
            selectedSeller:['790'],
            companyChips: ['790'],
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const removeClick = wrapper.findComponent({ref: 'remove-chips'});
        removeClick.vm.$emit('click',0,'790');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.companyChips.length).toBe(0);
    });

    it('should make a call with the filters apply', async()=> {
        await flushPromises();
        wrapper.setData({
            financeStatusItems: reconData.selectedDropDownData,
            selectedStatus: reconData.dropdownData
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const generateReport = wrapper.find('.apply-filter-button');
        generateReport.trigger('click');
        const close = jest.spyOn(wrapper.vm, 'close');
        expect(close).toHaveBeenCalledTimes(0);
    });

    it('get Dates', async() => {
        await flushPromises();
        wrapper.setData({
            storedIndex: 1,
            reconDate: [],
            fromDate: '',
            toDate: '',
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const dateRange = wrapper.find('.date-picker');
        dateRange.vm.$emit('input',1);
        expect(wrapper.vm.toDate.length).toBe(10);
    });

    // it('Get Date', () => {
    //     wrapper.vm.getInitialDates();
    //     wrapper.vm.dateRangeChange();
    // });
    // it('filter', () => {
    //     wrapper.vm.getStatus();
    //     wrapper.vm.getReconDate();
    //     wrapper.vm.resetDefault();
    //     let isValid = true;
    //     wrapper.vm.disableSave(isValid);
    // });
    /* it('Call Methods', async () => {
        wrapper.vm.open({pageSize});
        wrapper.vm.close({});
    }); */
    // it('generatedReport', async() => {
    //     wrapper.vm.generateRecon();
    //     await flushPromises();
    // });
    // it('dropdown functions', () => {
    //     wrapper.vm.filterDropdown(reconData.dropdownData,reconData.selectedDropDownData);
    //     wrapper.vm.selectedDropDownValue(reconData.dropdownData,reconData.selectedDropDownData);
    // });
})
