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
        const changeFilter = jest.spyOn(wrapper.vm, 'changeFilterType');
        await flushPromises();

        wrapper.setData({
            filterType: 'fynd_store',
        })

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const calledOnChangeFilter = wrapper.find('.filter-type');
        calledOnChangeFilter.vm.$emit('change');
        
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        expect(changeFilter).toHaveBeenCalled();
        expect(wrapper.vm.searchPlaceholder).toBe("Fynd Store");
        
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

        const copyClick = wrapper.find('.pagination-recon');
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
    e

    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find('.nitrozen-icon');
    searchInput.trigger('click',{
        index: 0,
    });

    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.tags).toHaveLength(2);
    
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


// describe('test MyComponent', () => {
//     const wrapper = mount(<MyComponent />);
//     const table = wrapper.find('table');
//     const row = table.find('tr')
//     const node = table.find(Node)

//     it('table grid', () => {
//         expect(table).toHaveLength(1);
//         expect(row).toHaveLength(whateverYouExpect);
//         expect(node).toHaveLength(whateverYouExpect);
//     });
// });
 




    // it('filter', () => {
    //     wrapper.vm.initialPayload();
    //     wrapper.vm.changeFilterType();
    //     wrapper.vm.reset();
    //     wrapper.vm.addeChips();
    //     wrapper.vm.removeChip(1);
    //     //wrapper.vm.generateListData(reconData);
    //     /* wrapper.vm.openReconFiltersDialog();
    //     wrapper.vm.$dialogClosed({}); */
    // });
    // it('generatedReport', async() => {
    //     mock.onPost(DOMAIN_URLS.GENERATE_REPORT(companyId)).reply(200, mocks.generateReportDetails);
    //     wrapper.vm.generateReport();
    //     await flushPromises();
    //     expect(wrapper.vm.inProgress).toBe(false);
    // });

    // it('get table data', async() => {
    //     wrapper.vm.generateListData(reconData.data);
    //     await wrapper.vm.$nextTick();
    // });
    
    // it('set route query', async() => {
    //     wrapper.vm.setRouteQuery({});
    //     await wrapper.vm.$nextTick();
    //     //expect(router.currentRoute.fullPath).toBe('/company/334/billing/bills?activeTab=2&search=17365926&page=1');
    // });
    // it('open drawer', async() => {
    //     const event = {
    //         stopPropagation: () => { }
    //     }
    //     wrapper.vm.closeFilter(event);
    //     wrapper.vm.quickFiltersSection();
        //expect(wrapper.vm.quickFilters).toBe(false);
    // })
    // it('filter based search', async() => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'filterSearch');
    //     await flushPromises();
    //     let reportTypes = wrapper.vm.filterSearch(reconData.e);
    //     await flushPromises();
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // });
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
