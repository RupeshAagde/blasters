import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { console } from 'window-or-global';
import BulkExport from '../../../../../../../pages/product/bulk/export/bulk-export.vue';

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

describe('Bulk Export', () => {
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
                    path: '/administrator/product/:type/export',
                    component: BulkExport
                }
            ]
        });
        router.push('/administrator/product/department/export');
        wrapper = mount(BulkExport, {
            localVue,
            router,
            computed: {
                userData: () => mocks.userData
            }
        });
        await flushPromises();
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
});
