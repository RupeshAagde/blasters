import { mount, createLocalVue } from '@vue/test-utils';
import CompanyComponent from '../../../../../pages/company-admin/company-list.vue';
import URLS from '../../../../../services/domain.service.js';

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MOCK_DATA from './fixtures/cbs-mock.json';
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
    });

    it('Fetch Company List Successfully, check wrapper and div should exists', async () => {
        mock.onGet(URLS.GET_COMPANY_LIST())
            .reply(200, { data: MOCK_DATA.company.data })
            .onAny()
            .reply(200, { data: MOCK_DATA.company.data });
        wrapper = mount(CompanyComponent, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.element).toMatchSnapshot();
        await flushPromises();
        mock.reset();
        // expect(wrapper.vm.brandsData.length).toBe(true);
    });

    it('List - should validate functions', async () => {
        mock.onGet(URLS.GET_COMPANY_LIST())
            .reply(200, { data: MOCK_DATA.company.data })
            .onAny()
            .reply(200, { data: MOCK_DATA.company.data });

        wrapper = mount(CompanyComponent, {
            localVue,
            router
        });
        await flushPromises();
        wrapper.vm.$set(wrapper.vm, 'companyList', MOCK_DATA.company.data);
        wrapper.vm.$set(wrapper.vm.pagination, 'total', 1);
        wrapper.vm.$set(wrapper.vm, 'searchText', 'testSearchText');
        wrapper.vm.clearSearchFilter();
        expect(wrapper.vm.searchText).toBe('');
        wrapper.vm.paginationChange({current:1, limit:10})
        wrapper.vm.companyView(wrapper.vm.companyList[0]);
        expect(wrapper.vm.$route.fullPath).toBe(
        '/administrator/company-details/1'
        );
        mock.reset();
    });

    it('Get Error on fetching Company List', async () => {
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(500, { error: true });
        wrapper = mount(CompanyComponent, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.vm.pageError).toBeTruthy();
        mock.reset();
    });
});
