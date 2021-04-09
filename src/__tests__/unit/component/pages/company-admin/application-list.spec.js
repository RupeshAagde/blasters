import { mount, createLocalVue } from '@vue/test-utils';
import URLS from '../../../../../services/domain.service.js';
import AppComponent from '../../../../../pages/company-admin/application-list.vue';

import MOCK_DATA from './fixtures/application-mock.json';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import AdminRoutes from '@/router/administrator/index.js';
import { Promise } from 'window-or-global';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('list, div and wrapper, check exists', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            AdminRoutes
        });
        router.push('/administrator/company-details/1');
    });

    it('Fetch Company List Successfully, check wrapper and div should exists', async () => {
        mock.onGet(URLS.FETCH_APPLICATIONS(1)).reply(
            200,
            MOCK_DATA.application.docs[0]
        );
        wrapper = mount(AppComponent, {
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
    });

    it('validate other functions', async () => {
        mock.onGet(URLS.FETCH_APPLICATIONS(1)).reply(
            200,
            MOCK_DATA.application.docs
        );
        wrapper = mount(AppComponent, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.vm.inProgress).toBe(false);
        wrapper.vm.$set(wrapper.vm, 'mainList', MOCK_DATA.application.docs);
        wrapper.vm.$set(
            wrapper.vm,
            'applicationList',
            MOCK_DATA.application.docs
        );
        wrapper.vm.$set(wrapper.vm.pagination, 'total', 1);
        wrapper.vm.$set(wrapper.vm, 'selectedFilter', 'active');
        wrapper.vm.$set(wrapper.vm, 'searchText', 'testSearchText');
        wrapper.vm.searchChannels();
        wrapper.vm.$set(wrapper.vm, 'searchText', '');
        wrapper.vm.searchChannels();
        wrapper.vm.paginationChange({ current: 1, limit: 10 });
        mock.reset();
    });

    it('Get Error on fetching Application List', async () => {
        mock.onGet(URLS.FETCH_APPLICATIONS(1)).reply(500, { error: true });
        wrapper = mount(AppComponent, {
            localVue,
            router
        });
        await flushPromises();
        // expect(wrapper.vm.pageError).toBeTruthy();
        mock.reset();
    });
});
