'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import SettlementRule from '../../../../../../pages/finance/settlement-rule/index.vue';
import mocks from '../fixtures/settlement.json';
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
describe('Settlement-Rule', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/settlement-rule',
                name: 'settlement-rule',
                component: SettlementRule
            }]
        });
        router.push('/administrator/finance/settlement-rule');
        wrapper = mount(SettlementRule, {
            localVue,
            router,
            stubs: {
                'jsonView': RoleModal,
            }
        });
        mock.onPost(DOMAIN_URLS.GET_COMPANY_LIST_FIN()).reply(200, mocks.getCompanyList);
        // mock.onPost(DOMAIN_URLS.GET_BRAND_LIST_FIN()).reply(200, mocks.downloadData);
        // mock.onPost(DOMAIN_URLS.GET_AFFILIATE_LIST_FIN()).reply(200, mocks.getPresigned);
        mock.onPost(DOMAIN_URLS.GET_DATA_FIN()).reply(200, mocks.getRuleList);
        // mock.onPost(DOMAIN_URLS.GET_UPLOAD_URL()).reply(200, mocks.confirmValidation);

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

    
})
