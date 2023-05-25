'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from "flush-promises";
import Popup from '../../../../../../../pages/finance/settlement-rule/create-rule/popup.vue';
import { expect } from '@jest/globals';

// Tell Jest to mock this import
jest.mock('lodash/debounce');

let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '11';

const RoleModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
}
describe('Finance', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/settlement-rule/create-rule',
                name: 'create-rule',
                component: Popup
            }]
        });
        router.push('/administrator/finance/settlement-rule/create-rule');
        jest.useFakeTimers();
        wrapper = mount(Popup, {
            localVue,
            router,
            
        });
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

    it('On clicking confirm button', async() => {

        await flushPromises();

        let confirmHelper = jest.spyOn(wrapper.vm, 'confirmHelper');
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const confirmBtn = wrapper.find('.yes_btn');
        confirmBtn.vm.$emit("click");
        await wrapper.vm.$nextTick();

        expect(confirmHelper).toHaveBeenCalled();

    
    });

    it('On clicking cancel button', async() => {

        await flushPromises();

        let cancelHelper = jest.spyOn(wrapper.vm, 'cancelHelper');
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const cancelBtn = wrapper.find('.no_btn');
        cancelBtn.vm.$emit("click");
        await wrapper.vm.$nextTick();

        expect(cancelHelper).toHaveBeenCalled();

    
    });
 
})
