'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import LearnDrawer from '../../../../../../pages/finance/bulk-upload/learn-drawer.vue';
// import APPLICATION_LIST_MOCK_DATA from '../company-admin/fixtures/application-mock.json';
//import BillingRoutes from '../../../../../router/admin/billing';
import mocks from '../fixtures/upload-reports.json';
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
                path: '/administrator/finance/bulk-upload',
                name: 'bulk-upload',
                component: LearnDrawer
            }]
        });
        router.push('/administrator/finance/bulk-upload');
        wrapper = shallowMount(LearnDrawer, {
            localVue,
            router,
            
        });
        mock.onPost(DOMAIN_URLS.GET_FILE_TYPE()).reply(200, mocks.getFileType);
        mock.onPost(DOMAIN_URLS.GET_DOWNLOAD_FORMAT()).reply(200, mocks.downloadData);
        // mock.onPost(DOMAIN_URLS.GET_REPORT()).reply(200, mocks.downloadedReports);
        // mock.onPost(DOMAIN_URLS.GENERATE_REPORT()).reply(200, mocks.generateReportDetails);
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

    it('close compoenent', async() => {

        await flushPromises();

        let closeBtn = jest.spyOn(wrapper.vm, 'closeDrawer');
      
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const closeEl = wrapper.find('.cross-btn');
        closeEl.trigger("click");

        await wrapper.vm.$nextTick();

        expect(closeBtn).toHaveBeenCalled();



    });

    
})
