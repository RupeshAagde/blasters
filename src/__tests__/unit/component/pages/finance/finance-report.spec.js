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
        const pageObject = {
            "limit": 10,
            "current": 2,
            "total": 70
        };
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.pageObject).toEqual(pageObject);
    });

    it('filter fullfilment should populate the data', async() => {
        const clickEvent = jest.spyOn(wrapper.vm, 'filterFulfillment');
        await flushPromises();
        wrapper.setData({
            selectedModel: ['JFC'],
            fulfillmentModel: [{
                    text: 'JFC',
                    value: 'JFC'
                },
                {
                    text: 'DFC',
                    value: 'DFC'
                }
            ],
        });
        
        let reportTypes = wrapper.vm.filterFulfillment();
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    it('placeholder change in fulfilment Type Dropdown', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'selectedFMT');
        await flushPromises();
        wrapper.setData({
            selectedModel: ['JFC'],
            fulfillmentModel: [{
                    text: 'JFC',
                    value: 'JFC'
                },
                {
                    text: 'DFC',
                    value: 'DFC'
                }
            ],
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('#fullfilment-type');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    it('changed fulfilment Type value DD', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'runLocation');
        const fullfilmentEvent = jest.spyOn(wrapper.vm, 'filterFulfillment');
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
        expect(fullfilmentEvent).toHaveBeenCalledTimes(1);

    });
    it('Change Seller selected', async () => {
        const copyClick = wrapper.find('#seller-name');
        copyClick.vm.$emit('searchInputChange', {text:'chandra'});
        jest.advanceTimersByTime(1000);
        const clickEvent = jest.spyOn(wrapper.vm, 'fetchCompany');
        await flushPromises();
        wrapper.setData({
            sellerNames: 'chandra'
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.sellerNames).toBe('chandra');
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

    it('selected Location IDs', async() => {
        const copyClick = wrapper.find('#seller-name');
        copyClick.vm.$emit('change');
        await wrapper.vm.$nextTick();
        const clickEvent = jest.spyOn(wrapper.vm, 'selectedIDT');
        wrapper.setData({
            selectedID: ['Hs-02'],
            locationID: [
                {
                    text: 'Hs-02',
                    value: 'Hs-02'
                }
            ],
        })
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });
    it('disable fulfillment dd on this reports', async() => {
        const copyClick = wrapper.find('#report-type');
        
        await wrapper.vm.$nextTick();
        const clickEvent = jest.spyOn(wrapper.vm, 'getReportDesc');//.mockImplementation();
        //wrapper.vm.getReportDesc('GST Credit Note Report');
        wrapper.setData({
            reportType: [
                {
                    text: 'GST Credit Note Report',
                    value: 'GST Credit Note Report',
                    description: 'GST Credit Note Report'
                }
            ],
            selectedReportType: 'GST Credit Note Report',
        })
        copyClick.vm.$emit('change', 'GST Credit Note Report');
        //wrapper.vm.getReportDesc('GST Credit Note Report');
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.reportDescription).toBe('GST Credit Note Report');
    });

    it('should change the nitrozen tab and the screen according', async () => {
        wrapper.setData({
            selectedReportTabIndex: 0,
            selectedReportTab: 'download-report'
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const advFilters = wrapper.findComponent({ref:'tabs'});
        advFilters.vm.$emit('tab-change', { index: 0 });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedReportTabIndex).toBe(0);
    });

    it('should change the nitrozen tab and the screen according', async () => {
        wrapper.setData({
            selectedReportTabIndex: 0,
            selectedReportTab: 'download-report'
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const advFilters = wrapper.findComponent({ref:'tabs'});
        advFilters.vm.$emit('tab-change', { index: 1 });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedReportTabIndex).toBe(0);
    });

    /* it('selectStageTab', async() => {
        wrapper.vm.tabChange({ index: 0 });
        wrapper.vm.tabChange({ index: 1 });
        await wrapper.vm.$nextTick();
    }); */

    it('should format the dates from unix to readable format', async() => {
        let clickEvent = jest.spyOn(wrapper.vm, 'dateFormat');
        //clickEvent = jest.fn().mockReturnValue('1657825752');
        clickEvent('1657825752');
        //expect(drink).toHaveReturnedWith('La Croix');
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    it('auto refresh should run after 10 seconds', async() => {
        let clickEvent = jest.spyOn(wrapper.vm, 'autoRefresh');
        wrapper.setData({
            count: 1,
            inProgress: false
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        clickEvent();
        jest.advanceTimersByTime(10000);
        expect(wrapper.vm.inProgress).toBe(false);
    });

    it('should show error when clicked on', async() => {
        const copyClick = wrapper.find('#report-error-btn');
        await wrapper.vm.$nextTick();
        const clickEvent = jest.spyOn(wrapper.vm, 'showError');
        clickEvent({},1)
        wrapper.setData({
            errorIndex: 1,
            cacheParams: {},
            errorAlert: true,
        });
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.errorAlert).toBe(true);
    });

    it('should show make noData true when clicked on if the msg is No data available', async() => {
        const copyClick = wrapper.find('#report-error-btn');
        await wrapper.vm.$nextTick();
        const clickEvent = jest.spyOn(wrapper.vm, 'showError');
        clickEvent({msg: 'No data available.'},1)
        wrapper.setData({
            noData: true
        });
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.noData).toBe(true);
    });

    it('should close and delete the error message on click of cross icon', async() => {
        const copyClick = wrapper.find('#hide-error');
        await wrapper.vm.$nextTick();
        const clickEvent = jest.spyOn(wrapper.vm, 'hideAlert');
        clickEvent({},1)
        wrapper.setData({
            noData: false,
            errorAlert: false
        });
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.noData).toBe(false);
    });

    it('Should clear the dropdown and change the location disable to true', async () => {
        const copyClick = wrapper.find('#report-type');
        const clickEvent = jest.spyOn(wrapper.vm, 'clearDD');
        copyClick.vm.$emit('searchInputChange', 'report-type');
        await flushPromises();
        wrapper.setData({
            selectedReportType: '',
            locationDisable: true
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.locationDisable).toBe(true);
    });

    it('Should clear the dropdown and disable the location id dropdown', async () => {
        const copyClick = wrapper.find('#report-type');
        const clickEvent = jest.spyOn(wrapper.vm, 'clearDD');
        clickEvent('fulfillment-type')
        copyClick.vm.$emit('searchInputChange', 'fulfillment-type');
        await flushPromises();
        wrapper.setData({
            selectedModel: '',
            haveFM: true
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.haveFM).toBe(true);
    });

    it('Should clear the Location ID dropdown', async () => {
        const copyClick = wrapper.find('#report-type');
        const clickEvent = jest.spyOn(wrapper.vm, 'clearDD');
        clickEvent('location-id')
        copyClick.vm.$emit('searchInputChange', 'fulfillment-type');
        await flushPromises();
        wrapper.setData({
            selectedID: '',
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedID).toBe('');
    });

    it('should return the pending state of the item', async() => {
        let clickEvent = jest.spyOn(wrapper.vm, 'inPending');
        clickEvent({ status: 'pending' });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveReturnedWith(true);
    });

    it('format string', async() => {
        const str = 'xyz,abc,pqr';
        const formatedVal = wrapper.vm.formatStrings(str);
        await wrapper.vm.$nextTick();
        expect(formatedVal).toBe('xyz');
        const formatedLen = wrapper.vm.dataLength(str);
        await wrapper.vm.$nextTick();
        expect(formatedLen).toBe(2);  
        
    });

    it('Open report generate dialog', async () => {
        const openReport = jest.spyOn(wrapper.vm, 'openReportGenerationDialog');
        wrapper.setData({
            selectedReportType: 'Invoice Summary',
        })

        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const generateBtn = wrapper.find('#generate-report');
        generateBtn.vm.$emit('click');

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        expect(openReport).toHaveBeenCalled();

        
    });

    


    // it('Should open the link on click of download icon', async () => {
    //     await flushPromises();
    //     wrapper.setData({
    //         errorAlert: false,
    //     });
        
    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
    //     const consentDrawer = wrapper.find('#report-download');
    //     consentDrawer.vm.$emit('click','https://gen.xyz.com')
    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
    //     expect(wrapper.vm.errorAlert).toBe(false);

    // }); 

    // it('open download link', async() => {
    //     await flushPromises();
    //     const triggerDownload = jest.spyOn(wrapper.vm, 'openLink');
    //     const downloadBtn = wrapper.find('#report-download');

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     downloadBtn.vm.$emit('click');
        
    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     expect(triggerDownload).toHaveBeenCalled();
    // });


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
    }); 
    */
  
    //  it('Show Error', async () => {
    //     wrapper.vm.getGeneratedReport();
    //     //console.log(wrapper.vm.$refs.reportGenerationDialog);
    //     const openMethod = jest.spyOn(wrapper.vm, 'showError')
    //     wrapper.vm.showError();
    //     await wrapper.vm.$nextTick();
    //     expect(openMethod).toHaveBeenCalled();
    // }); 
    

    

    
})
