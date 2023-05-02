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
        wrapper = mount(BulkUpload, {
            localVue,
            router,
            stubs: {
                'jsonView': RoleModal,
            }
        });
        mock.onPost(DOMAIN_URLS.GET_FILE_TYPE()).reply(200, mocks.getFileType);
        mock.onPost(DOMAIN_URLS.GET_DOWNLOAD_FORMAT()).reply(200, mocks.downloadData);
        mock.onPost(DOMAIN_URLS.GET_PRESIGNED_URL()).reply(200, mocks.getPresigned);
        mock.onPost(DOMAIN_URLS.GET_UPLOAD_URL()).reply(200, mocks.validatedFile);
        mock.onPost(DOMAIN_URLS.GET_UPLOAD_URL()).reply(200, mocks.confirmValidation);

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

    it('should check if the item is json or not', async() => {
        await flushPromises();
        let isJson = jest.spyOn(wrapper.vm, 'isJsonItem');
        wrapper.setData({
            tableData: {
                headers: mocks.validatedFile.data.json.headers,
                items: mocks.validatedFile.data.json.rows
            },
            validationCompleted: true
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const openJsonEditor = wrapper.find('.json-icon');
        openJsonEditor.trigger('click');
        expect(isJson).toHaveBeenCalled();
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
        let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');

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

        wrapper.setData({
            validationCompleted: true,
        });
      
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const cancelBtn = wrapper.find('#cancel-btn');
        cancelBtn.vm.$emit("click");

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.validationCompleted).toBe(false);
        expect(wrapper.vm.toggleUpload).toBe(true); 
        expect(wrapper.vm.fileSelected).toBe(false);

    });

    it('Open Learn here component', async() => {

        await flushPromises();

        let uploadClick = jest.spyOn(wrapper.vm, 'handleOpenDrawer');
        wrapper.setData({
            validationCompleted: true,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const cancelBtn = wrapper.find('.desc-link');
        cancelBtn.trigger("click");

        await wrapper.vm.$nextTick();

        expect(uploadClick).toHaveBeenCalled();

    });

    it('Process uploaded file', async() => {
        wrapper.vm.onFileUpload({target:{files:[{size: 20971, type: 'text/csv', name:'conshshhdhhhsggklshgkghdkhgdent.csv'}]}})
        expect(wrapper.vm.fileDetails.fileName).toBeDefined();

    });

    it('When the file size is 0', async() => {
        let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        wrapper.vm.onFileUpload({target:{files:[{size: 0, type: 'text/csv', name:'conshshhdhhhsggklshgkghdkhgdent.csv'}]}})
        expect(showErrorMethod).toHaveBeenCalled();

    });

    it('When the file size is greater than 500000', async() => {
        let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        wrapper.vm.onFileUpload({target:{files:[{size: 100000000, type: 'text/csv', name:'conshshhdhhhsggklshgkghdkhgdent.csv'}]}})
        expect(showErrorMethod).toHaveBeenCalled();

    });
    // it('Show Validation Screen', async() => {

    //     jest.useFakeTimers();
    //     // jest.spyOn(global, 'setInterval');

    //     await flushPromises();

    //     let uploadBtn = jest.spyOn(wrapper.vm, 'showValidateScreen');

    //     wrapper.setData({
    //         width: 100,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
        
    //     wrapper.vm.onFileUpload({target:{files:[{size: 100000000, type: 'text/csv', name:'conshshhdhhhsggklshgkghdkhgdent.csv'}]}})

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     jest.clearAllTimers()

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     console.log(uploadBtn);
        
    //     expect(uploadBtn).toHaveBeenCalled();

    // });

    it('Calling Presigned URL', async() => {

        await flushPromises();

        let callPresigned = jest.spyOn(wrapper.vm, 'getPreSignedUrl');
        wrapper.vm.showValidateScreen();

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.fileUploading).toBe(false);
        expect(wrapper.vm.isUploaded).toBe(true);
        expect(callPresigned).toHaveBeenCalled();
    
    });

    it('On clicking confirm button', async() => {

        await flushPromises();

        let confirmValidation = jest.spyOn(wrapper.vm, 'confirmValidation');
        wrapper.setData({
            validationCompleted: true,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const downloadBtn = wrapper.find('#confirm-btn');

        console.log(downloadBtn);

        downloadBtn.vm.$emit("click");

        await wrapper.vm.$nextTick();

        expect(confirmValidation).toHaveBeenCalled();

    
    });

    it('Showing Validation Screen', async() => {

        await flushPromises();

        wrapper.vm.getValidatedFileInfo();

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.startLoader).toBe(false);
    
    });
    // getValidatedFileInfo

    
})
