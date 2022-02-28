'use strict'

import { mount, createLocalVue } from '@vue/test-utils';
import PTedit from "../../../../../../pages/product/taxation/edit.vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MOCK_DATA from './mock_data.json'
import ADMIN_URLS from "../../../../../../services/domain.service.js"

let localVue;
const mock = new MockAdapter(axios);

describe('Product Taxation Edit', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    });

    it('Snapshot div should be truthy', async() => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/taxation/:uid/edit', component: PTedit }
            ]
        })
        router.push('/administrator/product/taxation/61152010-1/edit');
        mock.onGet(ADMIN_URLS.FETCH_HSNCODES()).reply(200, MOCK_DATA)
        const wrapper = mount(PTedit, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/taxation/61152010-1/edit');
        expect(wrapper.vm.$route.params.uid).toBe('61152010-1')
        expect(wrapper.vm.pageTitle()).toBe('Add Tax Rate')

    });

});