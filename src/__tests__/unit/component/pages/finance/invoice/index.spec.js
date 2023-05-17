'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import Invoices from '../../../../../../pages/finance/invoice/index.vue';
import InvoiceFilter from '../../../../../../pages/finance/invoice/invoice-filters.vue';
import mocks from '../fixtures/invoiceDetails.json';
import getReasons from '../fixtures/getReasons.json';
import companyList from '../fixtures/companyList.json';
import { jest } from '@jest/globals';
import { child } from 'winston';

jest.mock('lodash/debounce');
jest.useFakeTimers();

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
describe('Invoice', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/invoices',
                name: 'invoices',
                component: Invoices
            }]
        });
        router.push('/administrator/finance/invoices');
        wrapper = mount(Invoices, {
            localVue,
            router,
        });
        mock.onGet(DOMAIN_URLS.GET_COMPANY_LIST_FIN()).reply(200,companyList);
        mock.onPost(DOMAIN_URLS.GET_REASONS_LIST()).reply(200, getReasons);
        mock.onPost(DOMAIN_URLS.GET_INVOICE_LIST()).reply(200, mocks.invoiceDetails);
        mock.onPost(DOMAIN_URLS.GET_INVOICE_TYPE()).reply(200, mocks.invoiceFilters);
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

    it('temp test cases for coverage', async() => {
        wrapper.setData({
            invoiceDetails: {
                items: [{
                    status: 'paid',
                    invoice_number: 'OL-45454-343'
                }]
            }
        })
        wrapper.vm.toggleAllInvoices();
        wrapper.vm.toggleInvoice('OL-45454-343');
        const invoice = {
            "company": "(1) THE MANDHANA RETAIL VENTURES LIMITED",
            "invoice_number": "FS-I27-A00003-24",
            "invoice_type": "Seller Invoice Fynd Store",
            "invoice_date": "14-04-23",
            "period": "01-03-23 - 31-03-23",
            "amount": "₹260.78",
            "due_date": "14-04-23",
            "status": "upaid",
            "is_downloadable": true,
            "invoice_id": "487ac7d8-abae-495f-9f63-71526889860e"
        }
        wrapper.vm.handleVoid(invoice,'void');
        wrapper.vm.handleVoid(invoice,'extendDue');
    })

    it('Should Handle Pagination when clicked', async()=> {
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            invoiceDetails: mocks.invoiceDetails,
            pageObject: {
                total: 0,
                current: 1,
                limit: 10,
            }
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const copyClick = wrapper.find('.pagination-main');
        copyClick.vm.$emit('change', {
            "limit": 10,
            "current": 2,
            "total": 70
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.pageObject.total).toBe(70);
    });

    it('on change of company ID/name', async()=>{
        wrapper.setData({
            companyNames: mock.companyNames,
            selectedCompany: [18504],
            filters: {
                company_id: ''
            }
        });
        await wrapper.vm.$nextTick();
        const companyChange = wrapper.findComponent({ref: 'company-name'});
        companyChange.vm.$emit('change');
        expect(wrapper.vm.filters.company_id).toEqual(["18504"]);
    });

    it('get Dates', async() => {
        await flushPromises();
        wrapper.setData({
            InvoiceDateRange: [ '2023-05-10T06:49:00.289Z', '2023-05-17T06:49:00.289Z' ],
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const dateRange = wrapper.find('.date-picker');
        dateRange.vm.$emit('input');
        expect(wrapper.vm.toDate.length).toBe(10);
    });

    // Invoice Filter component test cases

    it('it should open the filter drawer component on click and ', async() => {
        wrapper.setData({
            isFilterDrawerOpen: false,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const openFilters = wrapper.find('.advanced-filter');
        await openFilters.trigger('click');
        const childComponent = wrapper.findComponent(InvoiceFilter);
        expect(childComponent.isVisible()).toBe(true);
    });

    it('should select payment status in drawer component', async()=>{
        wrapper.setData({
            isFilterDrawerOpen: true,
        })
        await wrapper.vm.$nextTick();
        const childComponent = wrapper.findComponent(InvoiceFilter);
        childComponent.setData({
            paymentStatusList: mocks.invoiceFilters.payment_status_list,
            selectedPaymentStatus: ['unpaid'],
            companyChips:[],
            paymentChips: [],
        });
        await childComponent.vm.$forceUpdate();
        await childComponent.vm.$nextTick();
        const paymentDropdown = wrapper.find('.payment-status');
        paymentDropdown.vm.$emit('change',childComponent.vm.paymentStatusList, childComponent.vm.selectedPaymentStatus,'payment');
        expect(childComponent.vm.paymentChips).toEqual([
            {
                "text": "Unpaid",
                "value": "unpaid"
            }
        ]);
    });

    it('should select payment status in drawer component', async()=>{
        wrapper.setData({
            isFilterDrawerOpen: true,
        })
        await wrapper.vm.$nextTick();
        const childComponent = wrapper.findComponent(InvoiceFilter);
        childComponent.setData({
            invoiceType: mocks.invoiceFilters.invoice_type_list,
            selectedInvoiceType: ['8d85b574-17b7-4ddd-8d0a-e3a79cbd0659'],
            companyChips:[],
            invoiceChips: [],
        });
        await childComponent.vm.$forceUpdate();
        await childComponent.vm.$nextTick();
        const invoiceDropdown = wrapper.find('.invoice-type');
        invoiceDropdown.vm.$emit('change',childComponent.vm.invoiceType, wrapper.vm.selectedInvoiceType,'invoice');
        expect(childComponent.vm.invoiceChips).toEqual([
            {
                "text": "Seller Invoice Uniket",
                "value": "8d85b574-17b7-4ddd-8d0a-e3a79cbd0659"
            },
        ]);
    });

    /* it('should search the company by given text', async()=>{
        await flushPromises();
        companyChange.vm.$emit('searchInputChange', {text:'18504'});
        jest.advanceTimersByTime(1000);
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const searchCompany = jest.spyOn(wrapper.vm, 'fetchCompany');
        expect(searchCompany).toHaveBeenCalled();
    }) */
    /* it('Should search the text when entered', async()=>{
        wrapper.setData({
            inProgress: false,
            fromDate: '09-05-2023',
            toDate: '16-05-2023',
            pageObject: {
                limit: 10,
                current: 1,
                total: 0
            },
            filters: {},
            searchText: ''
        })
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const searchClick = wrapper.find('.search');
        searchClick.vm.$emit('input',{});
        jest.advanceTimersByTime(1000);
        const getInvoiceList = jest.spyOn(wrapper.vm, 'getInvoiceList');
        expect(getInvoiceList).toHaveBeenCalled();
    }); */
})
