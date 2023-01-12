'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../services/domain.service';
import flushPromises from "flush-promises";
import FinanceReconciliation from '../../../../../pages/finance/finance-reconciliation.vue'
//import APPLICATION_LIST_MOCK_DATA from './fixtures/application-list.json';
/* import REGISTERED_MARKETPLACES from './../../../../fixtures/marketplace-data.json';
import ALL_MARKETPLACES from './../../../../fixtures/all-marketplaces.json'; */
//import BillingRoutes from '../../../../../router/admin/billing';
import mocks from './fixtures/reports.json';
import reconData from './fixtures/recon.json';
import reconListData from './fixtures/reconListData.json';
import Vuex from 'vuex';
//import ADMIN_URLS from '@/services/admin/admin-url.service';

let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '11';

const RoleModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
}
describe('FinanceReconciliation', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/bills-and-payouts?activeTab=1',
                name: 'account-ledgers',
                component: FinanceReconciliation
            }]
        });
        router.push('/administrator/finance/bills-and-payouts?activeTab=1');
        wrapper = mount(FinanceReconciliation, {
            localVue,
            router,
            /* computed: {
                companyApplications: () => APPLICATION_LIST_MOCK_DATA.items,
                registeredMarketplaces: () => REGISTERED_MARKETPLACES,
                fyndPlatformConf: () => ALL_MARKETPLACES,
            }, */
            stubs: {
                'reconFiltersDialog': RoleModal,
            }
        });
        //console.log(wrapper.vm);
        //mock.onGet(ADMIN_URLS.BRAND_DETAILS()).reply(200, mocks.brandDetails);
        mock.onPost(DOMAIN_URLS.GET_REPORT_TYPE(companyId)).reply(200, mocks.reportDetails);
        mock.onPost(DOMAIN_URLS.GET_CHANNEL(companyId)).reply(200, mocks.channelDetails);
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
    it('pagination data', async() => {
        wrapper.vm.handlePageChanges({ limit: 2, current: 1, total: 0 })
        await flushPromises();
        expect(wrapper.vm.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
   
    it('Get Date', () => {
        wrapper.vm.getDates();
    });

    it('Function call on changing filter', async() => {
        await flushPromises();
        wrapper.setData({
            filterType: 'shipment_id',
            filterTypeList: [
                {
                    text: 'Bag ID',
                    value: 'bag_id'
                },
                {
                    text: 'Shipment ID',
                    value: 'shipment_id'
                }
            ]
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const filterFun = wrapper.find('.filter-type');
        filterFun.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.searchPlaceholder).toBe(wrapper.vm.filterTypeList[1].text);
        
    });
    it('Close and Open Filter', async() => {

        const clickFilter = jest.spyOn(wrapper.vm, 'quickFiltersSection');
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const filterEl = wrapper.find('.filter');
        filterEl.trigger('click'); 

        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        expect(clickFilter).toHaveBeenCalled();
        
        
    });

    it('it changes the pagination method when the pagination is changed by the user', async () => {
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


it('it downloads report when clicked on download button', async() => {

    const triggerDownload = jest.spyOn(wrapper.vm, 'downloadReport');
    const downloadBtn = wrapper.find('.download');
    downloadBtn.trigger('click');
    await wrapper.vm.$nextTick();
    expect(triggerDownload).toHaveBeenCalled();

    });


it('adding chips when a specific bag id is searched', async() => {
    await flushPromises();
    wrapper.setData({
        search: '406095',
    })

    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find('#search-bar');
    searchInput.trigger('keyup.enter');
    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.tags).toHaveLength(1);
    
});

it('remove chips when cross button is clicked on respective chip', async() => {
    await flushPromises();
        wrapper.setData({
            tags: ['261801','281762'],
        });
    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();
    const removeChip = wrapper.find('#remove-chips');
    removeChip.vm.$emit('click', 1);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.tags.length).toBe(1);
    
});


it('expand tab on clicking on arrow in table', async() => {

    await flushPromises();

    const expandFn = jest.spyOn(wrapper.vm, 'expandRow');
    wrapper.setData({
        collapsedRowIndex: 0,
        tableDataItems: reconListData
    });

    console.log("Before");
    console.log(reconListData[1]);

    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    expandFn(reconListData[0],0);

    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.tableDataItems[1]).toEqual(expect.objectContaining({ "isErrorShown" : true }));
});

it('expand tab for error condition true', async() => {

    await flushPromises();

    const expandFn = jest.spyOn(wrapper.vm, 'expandRow');
    wrapper.setData({
        collapsedRowIndex: 0,
        tableDataItems: reconListData
    });

    console.log("Before");
    console.log(reconListData[1]);

    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    expandFn(reconListData[0],0);

    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.tableDataItems[0]).toEqual(expect.not.objectContaining({ "isErrorShown" : true }));
});

it('collapse tab on clicking on arrow in table', async() => {

    const collapseFn = jest.spyOn(wrapper.vm, 'collapse');
    // collapseFn(reconListData[1],1);
    wrapper.setData({
        expandedRow: true,
        collapsedRowIndex: 0,
        tableDataItems: reconListData
    });

    await flushPromises();
    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    // const advFilters = wrapper.find('#collapse-row');
    // advFilters.trigger('click', (
    //     reconListData[1],
    //     1
    // ));
    collapseFn(reconListData[0],0)
    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.tableDataItems[0]).toEqual(expect.not.objectContaining({ "isErrorShown" : true }));
});

 it('filter based search', async() => {
        const clickEvent = jest.spyOn(wrapper.vm, 'filterSearch');
        await flushPromises();
        clickEvent(reconData.e);
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    
    
it('auto refresh data', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
      const autoRefresh = jest.spyOn(wrapper.vm, 'autoRefresh');
      autoRefresh();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
    });


    /* it('open link', async() => {
        wrapper.vm.openLink(`https://gen.xyz.com`);
        await wrapper.vm.$nextTick();
    });
    it('format string', async() => {
        wrapper.vm.formatStrings('xyz abc pqr');
        wrapper.vm.dataLength('xyz abc pqr');
        await wrapper.vm.$nextTick();
    }); */
})
