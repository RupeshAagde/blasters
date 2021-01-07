import { mount, createLocalVue } from '@vue/test-utils';
import CompanyComponent from '../../../../../pages/company-admin/company-list.vue';
import URLS from '../../../../../services/domain.service.js';

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MOCK_DATA from './fixtures/company-list.json';
import AdminRoutes from '@/router/administrator/index.js';
import { Promise } from 'window-or-global';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('List Company List Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            AdminRoutes
        });
        router.push('/administrator/company-list');
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, MOCK_DATA.data);
        wrapper = mount(CompanyComponent, {
            localVue,
            router
        });
    });

    it('Fetch Company List Successfully', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        await flushPromises();
        // expect(wrapper.vm.brandsData.length).toBe(true);
    });

    it('Get Error on fetching Company List', async () => {
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(500, { error: true });
        wrapper = mount(CompanyComponent, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
    });
});
