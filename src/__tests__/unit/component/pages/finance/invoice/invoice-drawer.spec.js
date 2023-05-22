'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import mocks from '../fixtures/invoiceDetails.json';
import InvoicePayment from '../../../../../../pages/finance/invoice/invoice-drawer.vue';
import { jest } from '@jest/globals';

jest.useFakeTimers();

let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '11';

describe('Invoice Payment', ()=>{
    beforeEach(async () => {
        localVue = createLocalVue();
        mock.reset();
        wrapper = mount(InvoicePayment, {
            localVue,
            propsData: { 
                invoice: {
                    "company": "(61) FUCHSIA VINE DESIGNS PRIVATE LIMITED",
                    "invoice_number": "UN-P-A00008-FY24",
                    "invoice_type": "Seller Invoice Uniket",
                    "invoice_date": "17-05-23",
                    "period": "01-05-23 - 31-05-23",
                    "amount": "₹243.08",
                    "due_date": "20-05-23",
                    "status": "unpaid",
                    "is_downloadable": true,
                    "invoice_id": "5b1d13fd-c850-45b1-aaa5-6546a6c5b403"
                },
            },
        });
        //mock.onGet(DOMAIN_URLS.CREDITLINE_PAYMENTS()).reply(200,mocks.paymentProcess);
        
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

    it('should process the offline payments in cash', async()=>{
        wrapper.setData({
            offlineData: {
                chequeNum: '',
                utrNum: '',
            },
            paymentSelection: 'cash',
            remarks: '',
            presignedUrl: '',
            enableTranSave: false,
        });
        await wrapper.vm.$nextTick();
        const saveOffline = wrapper.find('.save-offline');
        await saveOffline.trigger('click');
        mock.onPost(DOMAIN_URLS.CREDITLINE_PAYMENTS()).reply(200,mocks.paymentProcess);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.remarks).toEqual('');
    });

    it('should process the offline payments in cheque', async()=>{
        wrapper.setData({
            offlineData: {
                chequeNum: '44454545',
                utrNum: '45444545',
            },
            paymentSelection: 'cheque',
            remarks: '',
            presignedUrl: '',
            enableTranSave: false,
        });
        await wrapper.vm.$nextTick();
        const saveOffline = wrapper.find('.save-offline');
        await saveOffline.trigger('click');
        mock.onPost(DOMAIN_URLS.CREDITLINE_PAYMENTS()).reply(200,mocks.paymentProcess);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.remarks).toEqual('');
    });

    it('should process the offline payments in cash', async()=>{
        wrapper.setData({
            offlineData: {
                chequeNum: '',
                utrNum: '',
            },
            paymentSelection: 'cash',
            remarks: '',
            presignedUrl: '',
            enableTranSave: false,
        });
        await wrapper.vm.$nextTick();
        const saveOffline = wrapper.find('.save-offline');
        await saveOffline.trigger('click');
        mock.onPost(DOMAIN_URLS.CREDITLINE_PAYMENTS()).reply(500,mocks.paymentFailed);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.remarks).toEqual('');
    });

    it('should change payment option when clicked on the radio button', async() => {
        wrapper.setData({
            paymentSelection: 'cash',
            paymentMode: {
                cash: false,
                cheque: true,
            },
            remarks:'',
            fileDetails: {
                fileName: '',
                fileMbSize: ''
            },
            presignedUrl: '',
            intervalId: '',
            file: new Blob()
        });
        await wrapper.vm.$nextTick();
        const paymentOption = wrapper.find('.payment-optn');
        paymentOption.vm.$emit('change');
        expect(wrapper.vm.paymentMode.cash).toBe(true);
    });

    it('should upload the file and get the presigned URL', async()=>{
        let uploadBtn = jest.spyOn(wrapper.vm, 'onUploadClick');
        wrapper.setData({
            fileDetails: {
                fileName: '',
                fileMbSize: ''
            },
            presignedUrl: '',
            paymentSelection: 'cash',
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const selectFileEl = wrapper.find('#select-file');
        selectFileEl.trigger("click");
        await wrapper.vm.$nextTick();
        expect(uploadBtn).toHaveBeenCalled();
    });

    it('Process uploaded file', async() => {
        let getPreSignedUrl = jest.spyOn(wrapper.vm, 'getPreSignedUrl');
        let frame = jest.spyOn(wrapper.vm, 'frame');
        wrapper.setData({
            fileDetails: {
                fileName: '',
                fileMbSize: ''
            },
            presignedUrl: '',
            paymentSelection: 'cash'
        })
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        wrapper.vm.onFileUpload({target:{files:[{size: 52562, type: "image/png", name: "Screenshot 2023-05-17 at 4.27.37 PM.png"}]}})
        jest.advanceTimersByTime(10);
        expect(wrapper.vm.fileDetails.fileName).toBeDefined();
        expect(frame).toHaveBeenCalled();

        jest.advanceTimersByTime(1050);
        mock.onPost(DOMAIN_URLS.GET_PRESIGNED_URL()).reply(200, mocks.getPresignURL);
        expect(getPreSignedUrl).toHaveBeenCalled();
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
})