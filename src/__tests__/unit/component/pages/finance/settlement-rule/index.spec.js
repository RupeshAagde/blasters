'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import SettlementRule from '../../../../../../pages/finance/bulk-upload/bulk-upload.vue';
import mocks from '../fixtures/upload-reports.json';
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
                path: '/administrator/finance/bulk-upload',
                name: 'bulk-upload',
                component: SettlementRule
            }]
        });
        router.push('/administrator/finance/bulk-upload');
        wrapper = mount(SettlementRule, {
            localVue,
            router,
            stubs: {
                'jsonView': RoleModal,
            }
        });
        mock.onPost(DOMAIN_URLS.GET_FILE_TYPE()).reply(200, mocks.getFileType);
        mock.onPost(DOMAIN_URLS.GET_DOWNLOAD_FORMAT()).reply(200, mocks.downloadData);
        mock.onPost(DOMAIN_URLS.GET_PRESIGNED_URL()).reply(200, mocks.getPresigned);
        mock.onPost(DOMAIN_URLS.GET_UPLOAD_URL()).reply(200, mocks.validatedFile);
        mock.onPost(DOMAIN_URLS.GET_UPLOAD_URL()).reply(200, mocks.confirmValidation);

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
