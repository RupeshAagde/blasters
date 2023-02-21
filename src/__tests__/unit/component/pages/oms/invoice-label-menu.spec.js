'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import InvoiceLabelMenu from '@/pages/oms/invoice-label-menu.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '@/services/domain.service';
import INVOICE_LABEL_MOCK from './fixtures/invoice-label-menu-mocks.json'
// import cloneDeep from 'lodash/cloneDeep';

import flushPromises from "flush-promises";
import { wrap } from 'lodash';
let localVue;
const mock = new MockAdapter(axios);
let wrapper, router
const companyId = '41';
describe('Order/Shipment List Page', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        // mock.onPost(URLS.GENERATE_PRESIGNED_URL(INVOICE_LABEL_MOCK.label_invoice_params)).reply(200, INVOICE_LABEL_MOCK.label_invoice_response)
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/get-single-presigned-url', component: InvoiceLabelMenu }
            ]
        })
        router.push(`/company/41/get-single-presigned-url`);
        let toggleMenu = "invoice"
        let shipment = INVOICE_LABEL_MOCK.shipment_prop
        let viewType = false 
        wrapper = mount(InvoiceLabelMenu, {
            localVue,
            router,
            propsData: {
                toggleMenu, shipment, viewType
            },
            data() {
                return {
                }
            },
            computed: {
                accessDetail: () => INVOICE_LABEL_MOCK.access_detail,
                userinfo: () => INVOICE_LABEL_MOCK.user_info
            }
        });
        await flushPromises();
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('is a Vue instance', () => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('it makes post request to the api calling the getDoucmentUrl method with param(get_type = "download") and also downloads the invoice/label', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'getDocumentURL');
        await flushPromises();

        let a = wrapper.find('.download-invoice-label')
        a.trigger('click', 'invoice_a4','download', undefined)
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    // it('it does not call the api', async () => {
    //     mock.onPost(URLS.GENERATE_PRESIGNED_URL(INVOICE_LABEL_MOCK.label_invoice_params)).reply(500, {})

    //     const clickEvent = jest.spyOn(wrapper.vm, 'getDocumentURL');
    //     await flushPromises();

    //     let a = wrapper.find('.download-invoice-label')
    //     a.trigger('click', 'invoice' + '_a4','download')
    //     await flushPromises();
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // }); 
    
    // it('it makes post request to the api calling the getDoucmentUrl method with param(get_type = "view") and also downloads the invoice/label', async () => {
    //     mock.onPost(URLS.GENERATE_PRESIGNED_URL(INVOICE_LABEL_MOCK.label_invoice_params)).reply(200, INVOICE_LABEL_MOCK.label_invoice_response)

    //     const clickEvent = jest.spyOn(wrapper.vm, 'getDocumentURL');
    //     await flushPromises();

        
    //     let a = wrapper.vm.getDocumentURL('invoice' + '_a4', 'view')
    //     console.log(a)
    //     await flushPromises();
    //     await wrapper.vm.$nextTick();
    //     // expect(clickEvent).toHaveBeenCalled();
    // });

});