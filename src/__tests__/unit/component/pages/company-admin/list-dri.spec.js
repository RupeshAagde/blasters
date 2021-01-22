import { mount, createLocalVue } from '@vue/test-utils';
import ListDriComponent from '../../../../../pages/company-admin/list-dri.vue';
import URLS from '../../../../../services/domain.service.js';

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MOCK_DATA from './fixtures/dri-mock.json';
import AdminRoutes from '@/router/administrator/index.js';
import { console, Promise } from 'window-or-global';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('LIST DRI component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            AdminRoutes
        });
        router.push('/administrator/company-details/1');
    });

    it('check list, wrapper and mount', async () => {
        mock.onGet(URLS.FETCH_DRI())
            .reply(200, { data: MOCK_DATA['dri-list'] })
            .onAny()
            .reply(200, { data: MOCK_DATA['dri-list'] });
        wrapper = mount(ListDriComponent, {
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
        mock.onGet(URLS.FETCH_DRI())
            .reply(200, { data: MOCK_DATA['dri-list'] })
            .onAny()
            .reply(200, { data: MOCK_DATA['dri-list'] });
        wrapper = mount(ListDriComponent, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(false)
        wrapper.vm.$set(wrapper.vm, 'driList', MOCK_DATA['dri-list']);
        wrapper.vm.$set(wrapper.vm.pagination, 'total', 1);
        wrapper.vm.$set(wrapper.vm, 'searchText', 'testSearchText');
        wrapper.vm.paginationChange({current:1, limit:10});
        mock.reset();
    });

    it('validate redirection functions', async () => {
        mock.onGet(URLS.FETCH_DRI())
            .reply(200, { data: MOCK_DATA['dri-list'] })
            .onAny()
            .reply(200, { data: MOCK_DATA['dri-list'] });
        wrapper = mount(ListDriComponent, {
            localVue,
            router
        });
        await flushPromises();
        wrapper.vm.$set(wrapper.vm, 'companyId', 1);
        wrapper.vm.openAdd();
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/company-details/1/add-dri');
        router.push('/administrator/company-details/1');
        wrapper.vm.openEdit(MOCK_DATA['dri-list'][0].uid);
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/company-details/1/edit-dri/1');
        router.push('/administrator/company-details/1');
        mock.reset();
    })

    it('Get Error on fetching List', async () => {
        mock.onGet(URLS.FETCH_DRI()).reply(500, { error: true });
        wrapper = mount(ListDriComponent, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.vm.pageError).toBeTruthy();
        mock.reset();
    });
});
