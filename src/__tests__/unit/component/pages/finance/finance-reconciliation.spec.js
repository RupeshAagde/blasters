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
import mocks from './fixtures/reports.json'
import reconData from './fixtures/recon.json'
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
    /* it('selectStageTab', async() => {
        wrapper.vm.tabChange({ index: 0 });
        await wrapper.vm.$nextTick();
    }); */
    it('Get Date', () => {
        wrapper.vm.getDates();
        wrapper.vm.autoRefresh();
    });
    it('filter', () => {
        wrapper.vm.initialPayload();
        wrapper.vm.changeFilterType();
        wrapper.vm.reset();
        wrapper.vm.addeChips();
        wrapper.vm.removeChip(1);
        //wrapper.vm.generateListData(reconData);
        /* wrapper.vm.openReconFiltersDialog();
        wrapper.vm.$dialogClosed({}); */
    });
    it('generatedReport', async() => {
        mock.onPost(DOMAIN_URLS.GENERATE_REPORT(companyId)).reply(200, mocks.generateReportDetails);
        wrapper.vm.generateReport();
        await flushPromises();
        expect(wrapper.vm.inProgress).toBe(false);
    });
    it('download report', async() => {
        wrapper.vm.downloadReport();
        wrapper.vm.getGeneratedReport();
        await flushPromises();
    });
    it('get table data', async() => {
        wrapper.vm.generateListData(reconData.data);
        await wrapper.vm.$nextTick();
    });
    it('expand and collapse tab', () => {
        wrapper.vm.expandRow(reconData.tab, 1);
        wrapper.vm.collapse(reconData.tab, 1);
    });
    it('set route query', async() => {
        wrapper.vm.setRouteQuery({});
        await wrapper.vm.$nextTick();
        //expect(router.currentRoute.fullPath).toBe('/company/334/billing/bills?activeTab=2&search=17365926&page=1');
    });
    it('open drawer', async() => {
        const event = {
            stopPropagation: () => { }
        }
        wrapper.vm.closeFilter(event);
        wrapper.vm.quickFiltersSection();
        //expect(wrapper.vm.quickFilters).toBe(false);
    })
    it('filter based search', async() => {
        const clickEvent = jest.spyOn(wrapper.vm, 'filterSearch');
        await flushPromises();
        let reportTypes = wrapper.vm.filterSearch(reconData.e);
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
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
