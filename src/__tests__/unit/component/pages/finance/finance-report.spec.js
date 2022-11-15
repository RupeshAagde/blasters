'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../services/domain.service';
import flushPromises from "flush-promises";
import FinanceReport from '../../../../../pages/finance/finance-report.vue';
import APPLICATION_LIST_MOCK_DATA from '../company-admin/fixtures/application-mock.json';
//import BillingRoutes from '../../../../../router/admin/billing';
import mocks from './fixtures/reports.json'
//import Vuex from 'vuex';
import ADMIN_URLS from '@/services/admin-url.service';

let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '11';

jest.useFakeTimers();

const RoleModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
}
describe('Finance', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/bills-and-payouts?activeTab=0',
                name: 'report-generator',
                component: FinanceReport
            }]
        });
        router.push('/administrator/finance/bills-and-payouts?activeTab=0');
        wrapper = shallowMount(FinanceReport, {
            localVue,
            router,
            computed: {
                companyApplications: () => APPLICATION_LIST_MOCK_DATA.application.docs,
            },
            stubs: {
                'reportGenerationDialog': RoleModal,
            }
        });
        //console.log(wrapper.vm);
        //mock.onGet(ADMIN_URLS.BRAND_DETAILS()).reply(200, mocks.brandDetails);
        mock.onPost(DOMAIN_URLS.GET_REPORT_TYPE()).reply(200, mocks.reportDetails);
        mock.onPost(DOMAIN_URLS.GET_CHANNEL()).reply(200, mocks.channelDetails);
        mock.onPost(DOMAIN_URLS.GET_REPORT()).reply(200, mocks.downloadedReports);
        mock.onPost(DOMAIN_URLS.GENERATE_REPORT()).reply(200, mocks.generateReportDetails);
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
    it('it changes the pagination method when the pagination is changed by the user', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'handlePageChanges');
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.pagination-main');
        copyClick.vm.$emit('change', {
            "limit": 10,
            "current": 2,
            "total": 70
        });
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });
    it('filter fullfilment array', async() => {
        const clickEvent = jest.spyOn(wrapper.vm, 'filterFulfillment');
        await flushPromises();
        wrapper.setData({
            selectedModel: ['JFC'],
            fulfillmentModel: ['JFC','DFC'],
        });
        
        let reportTypes = wrapper.vm.filterFulfillment();
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });
    it('placeholder change in fulfilment Type DD', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'selectedFMT');
        await flushPromises();
        wrapper.setData({
            selectedModel: ['JFC'],
            fulfillmentModel: ['JFC','DFC'],
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('#fullfilment-type');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();

    });
    it('changed fulfilment Type value DD', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'runLocation');
        await flushPromises();
        wrapper.setData({
            selectedModel: ['JFC'],
            haveFM: false,
            locationDisable: false
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('#fullfilment-type');
        copyClick.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();

    });
    it('Change Seller selected', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'searchCompany');
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('#seller-name');
        copyClick.vm.$emit('searchInputChange', {text:'chandra'});
        jest.advanceTimersByTime(1000);
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });
    it('selected seller name', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'setCompanyList');
        wrapper.setData({
            companyChips: ['aaa','bbb']
        });
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('#seller-name');
        copyClick.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    it('selected Location IDs', () => {
        wrapper.setData({
            selectedID: ['Hs-01'],
            locationID: [
                {
                    text: 'Hs-01',
                    value: 'Hs-01'
                }
            ],
        })
        wrapper.vm.selectedIDT();
    });
    it('disable fulfillment dd on this reports', () => {
        wrapper.setData({
            reportType: [
                {
                    text: 'GST Credit Note Report',
                    value: 'GST Credit Note Report',
                    description: 'GST Credit Note Report'
                }
            ],
        })
        wrapper.vm.getReportDesc('GST Credit Note Report');
    });
    it('selectStageTab', async() => {
        wrapper.vm.tabChange({ index: 0 });
        wrapper.vm.tabChange({ index: 1 });
        await wrapper.vm.$nextTick();
    });
    it('Get Date', () => {
        wrapper.vm.getDates();
        wrapper.vm.dateFormat('1657825752');
        wrapper.vm.autoRefresh();
        jest.advanceTimersByTime(10000);
    });
    it('generatedReport', async() => {
        wrapper.vm.selectedIDT();
        wrapper.vm.showError({},1);
        wrapper.vm.hideAlert({},1);
        await flushPromises();
    });
    it('clear DropDown value', () => {
        wrapper.vm.clearDD('report-type');
        wrapper.vm.clearDD('fulfillment-type');
        wrapper.vm.clearDD('location-id');
    })
    it('pending status test', () => {
        let tab = {
            status: 'pending',
        }
        wrapper.vm.inPending(tab);
    })
    it('open link', async() => {
        wrapper.vm.openLink(`https://gen.xyz.com`);
        await wrapper.vm.$nextTick();
    });
    it('format string', async() => {
        wrapper.vm.formatStrings('xyz abc pqr');
        wrapper.vm.dataLength('xyz abc pqr');
        await wrapper.vm.$nextTick();
    });
    it('location dd test', async() => {
        //wrapper.vm.getLocation();
        wrapper.vm.runLocation();
        await flushPromises();
    });

    it('Open report generate dialog', async () => {
        //console.log(wrapper.vm.$refs.reportGenerationDialog);
        let report = {date: '01-01-2022'};
        //wrapper.vm.openReportGenerationDialog(report.date);
        wrapper.vm.$dialogClosed({});
        await flushPromises();
    });

    /* it(('get report Description'), () => {
        let reportValue = 'test';
        let reportSelected = {
            description: 'test'
        };
        let reportType = {
            text: 'test',
            value: 'test',
            description: 'test'
        }
        let reportDescription = '';
        wrapper.vm.getReportDesc('test');
        console.log(reportSelected);
        expect(wrapper.vm.reportDescription.length).toBeGreaterThanOrEqual(1);
    }); */
    /* it('Open report generate dialog', async () => {
        //console.log(wrapper.vm.$refs.reportGenerationDialog);
        const openMethod = jest.spyOn(wrapper.vm.$refs.reportGenerationDialog, 'open')
        wrapper.vm.openReportGenerationDialog();
        await wrapper.vm.$nextTick();
        expect(openMethod).toHaveBeenCalled();
    }); */
    /* it('Show Error', async () => {
        wrapper.vm.getGeneratedReport();
        //console.log(wrapper.vm.$refs.reportGenerationDialog);
        const openMethod = jest.spyOn(wrapper.vm, 'showError')
        wrapper.vm.showError();
        await wrapper.vm.$nextTick();
        expect(openMethod).toHaveBeenCalled();
    }); */
})
