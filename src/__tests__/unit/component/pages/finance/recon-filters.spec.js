'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ReconFilters from '../../../../../pages/finance/recon-filters.vue';
//import APPLICATION_LIST_MOCK_DATA from './../../../../fixtures/application-list.json';
import mocks from './fixtures/reports.json'
import reconData from './fixtures/recon.json'
//import Vuex from 'vuex';
//import ADMIN_URLS from '@/services/admin/admin-url.service';

let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '11';
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
        mock.onPost(DOMAIN_URLS.GET_REPORT_TYPE(companyId)).reply(200, mocks.reportDetails);
        mock.onPost(DOMAIN_URLS.GET_REPORT(companyId)).reply(200, mocks.downloadedReports);
        mock.onPost(DOMAIN_URLS.GENERATE_REPORT(companyId)).reply(200, mocks.generateReportDetails);
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
            selectedSeller:"AAA",
        });
        
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();


        const copyClick = wrapper.find('#report-type');
        copyClick.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalledTimes(1);

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
