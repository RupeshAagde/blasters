import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { console } from 'window-or-global';
import ImportHistory from '../../../../../../../pages/product/bulk/import/upload-history.vue';

import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';

import URLS from '../../../../../../../services/domain.service.js';
import mocks from '../mocks';

let localVue;
const mock = new MockAdapter(axios);

const CsvView = {
    render: () => {},
    methods: {
        createGrid: () => {
            return true;
        },
        removeGrid: () => {
            return true;
        }
    }
};

describe('Load Import History', () => {
    let wrapper;
    let router;
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    });

    it('Render', async () => {
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/product/:type/import/upload-history',
                    component: ImportHistory
                }
            ]
        });
        mock.onGet(URLS.BULK_HISTORY_REQUEST()).reply(200, mocks.importHistory);
        router.push('/administrator/product/department/import/upload-history');
        wrapper = mount(ImportHistory, {
            localVue,
            router
        });
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
});
