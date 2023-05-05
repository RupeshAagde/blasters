'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import Invoices from '../../../../../../pages/finance/invoice/index.vue';
//import mocks from '../../fixtures/upload-reports.json';
import { jest } from '@jest/globals';

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
        mock.onPost(DOMAIN_URLS.GET_COMPANY_LIST_FIN()).reply(200, [{'text':'AAA','value':'aaa'}]);
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

    /* it('Should Handle Pagination when clicked', async()=> {
        await flushPromises();
        wrapper.setData({
            paginationObj: {
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
        expect(wrapper.vm.paginationObj.total).toBe(70);
    }); */

    /* it('Should Refresh the page when clicked', async()=> {
        await flushPromises();
        const copyClick = wrapper.find('.right-head')
        copyClick.trigger('click');
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.inProcess).toBe(false);
    }); */
})
