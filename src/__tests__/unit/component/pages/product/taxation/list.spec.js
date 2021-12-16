'use strict'

import { mount, createLocalVue } from '@vue/test-utils';
import PTList from "../../../../../../pages/product/taxation/list.vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MOCK_DATA from './mock_data.json'
import ADMIN_URLS from "../../../../../../services/domain.service.js"

let localVue;
const mock = new MockAdapter(axios);

describe('Product Taxation List', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    });

    it('Snapshot div should be truthy', async() => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/taxation', component: PTList }
            ]
        })
        router.push('/administrator/product/taxation');
        mock.onGet(ADMIN_URLS.FETCH_HSNCODES()).reply(200, MOCK_DATA)
        const wrapper = mount(PTList, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

});