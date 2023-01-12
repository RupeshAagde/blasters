'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../services/domain.service';
import flushPromises from "flush-promises";
import reportGenerationDialog from '../../../../../pages/finance/report-generation-dialog.vue'
//import BillingRoutes from '../../../../../router/admin/billing';
import mocks from './fixtures/reports.json'
/* import Vuex from 'vuex';
import ADMIN_URLS from '@/services/admin/admin-url.service'; */

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
describe('Finance', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        wrapper = mount(reportGenerationDialog, {
            localVue,
        });
        mock.onPost(DOMAIN_URLS.GENERATE_REPORT(companyId)).reply(200, mocks.generateReportDetails);
        await flushPromises();
    });

    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('.report-dialog');
        expect(div.exists()).toBe(true);
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('it generates report when clicked on generate report button', async() => {

        const generateReport = jest.spyOn(wrapper.vm, 'generateReport');

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const reportBtn = wrapper.find('#generate-btn');
        reportBtn.trigger('click');

        await wrapper.vm.$nextTick();

        expect(generateReport).toHaveBeenCalled();
    
    });

    it('change from and to dates', async() => {

        const dataRange = jest.spyOn(wrapper.vm, 'dateRangeChange');

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const reportBtn = wrapper.find('.date-picker');

        reportBtn.vm.$emit('input');

        await wrapper.vm.$nextTick();

        expect(dataRange).toHaveBeenCalled();
    
        });

        it('Call Methods', async () => {
        wrapper.vm.open(mocks.dialogData);
        wrapper.vm.close({});
    });
    

    //  it('pagination data', async() => {
    //     wrapper.vm.handlePageChanges({ limit: 2, current: 1, total: 0 })
    //     await flushPromises();
    //     expect(wrapper.vm.tableColumns.length).toBeGreaterThanOrEqual(1);
    // }); 
})