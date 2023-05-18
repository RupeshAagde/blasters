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
                cash: true,
                cheque: false,
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
        wrapper.setData({
            fileDetails: {
                fileName: '',
                fileMbSize: ''
            },
            presignedUrl: '',
            paymentSelection: 'cash',
        });
        await wrapper.vm.$nextTick();
        /* const uploadClick = wrapper.findComponent({ref:'select-file'});
        uploadClick.vm.$emit('click',{target:{value:"C:\\fakepath\\Screenshot 2023-05-17 at 4.27.37 PM.png"}});
        expect(wrapper.vm.presignedUrl).toEqual(''); */
        wrapper.vm.onUploadClick({target:{value:"C:\\fakepath\\Screenshot 2023-05-17 at 4.27.37 PM.png"}});
    });
})