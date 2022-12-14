'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import popup from '@/pages/tickets/configuration/common/PopUp.vue';
import ADMIN_URLS from '@/services/domain.service';

let localVue;
const mock = new MockAdapter(axios);
describe('popup Page', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })

    it('renders popup page', () => {
        const wrapper = shallowMount(popup)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('confirmHelper', () => {
        const wrapper = shallowMount(popup)
        wrapper.vm.confirmHelper();
        wrapper.vm.$nextTick();
        // expect(wrapper.find(".warningPopUp").exists()).toBe(false);
        wrapper.vm.$emit('confirm')
    })

    it('cancelHelper', () => {
        const wrapper = shallowMount(popup)
        wrapper.vm.cancelHelper();
        wrapper.vm.$nextTick();
        // expect(wrapper.find(".warningPopUp").exists()).toBe(false);
        wrapper.vm.$emit('cancel')
    })
})