'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import BulkUpload from '../../../../../../pages/finance/bulk-upload/bulk-upload.vue';
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
                component: BulkUpload
            }]
        });
        router.push('/administrator/finance/bulk-upload');
        wrapper = shallowMount(BulkUpload, {
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

    it('download button clicked with and without id', async() => {

        await flushPromises();

        let downloadEl = jest.spyOn(wrapper.vm, 'downloadFormat');
        wrapper.setData({
            toggleUpload: true,
            selectedFileType: 'd9987e2f-d3f2-4040-a751-2175c661de22'
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const downloadBtn = wrapper.find('#download-fbtn');
        downloadBtn.vm.$emit("click");

        await wrapper.vm.$nextTick();

        expect(downloadEl).toHaveBeenCalled();

        wrapper.setData({
            selectedFileType: ''
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        downloadBtn.vm.$emit("click");
        await wrapper.vm.$nextTick();
        expect(downloadEl).toHaveBeenCalled();

    });

    it('open select file window with and without report id', async() => {

        await flushPromises();

        let uploadBtn = jest.spyOn(wrapper.vm, 'onUploadClick');
        wrapper.setData({
            toggleUpload: true,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const selectFileEl = wrapper.find('#select-file');
        selectFileEl.trigger("click");
        await wrapper.vm.$nextTick();

        expect(uploadBtn).toHaveBeenCalled();

        wrapper.setData({
            toggleUpload: true,
            selectedFileType: 'd9987e2f-d3f2-4040-a751-2175c661de22'
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        selectFileEl.trigger("click");
        await wrapper.vm.$nextTick();

        expect(uploadBtn).toHaveBeenCalled();

    });

    it('When clicked on cancel validation button', async() => {

        await flushPromises();

        let uploadClick = jest.spyOn(wrapper.vm, 'cancelValidation');
        wrapper.setData({
            validationCompleted: true,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const cancelBtn = wrapper.find('.cancel-btn');
        cancelBtn.vm.$emit("click");

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.validationCompleted).toBe(false);
        expect(wrapper.vm.toggleUpload).toBe(true); 
        expect(wrapper.vm.fileSelected).toBe(false);

    });

    
})
