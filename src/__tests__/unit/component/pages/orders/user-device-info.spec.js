'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import UserDeviceInfo from '@/pages/orders/user-device-info.vue';
import VueRouter from 'vue-router';

let wrapper, router, localVue
describe('User Device Info - Case1', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: UserDeviceInfo }
            ]
        })
        router.push(`/orders/list/`);
        const user_agent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.2 (KHTML, like Gecko) Ubuntu/11.10 Chromium/15.0.874.106 Chrome/15.0.874.106 Safari/535.2";
        wrapper = shallowMount(UserDeviceInfo, {
            localVue,
            router,
            propsData: { user_agent: user_agent }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Render Check', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
});

describe('User Device Info - Case2', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: UserDeviceInfo }
            ]
        })
        router.push(`/orders/list/`);
        const user_agent = "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.11 (KHTML, like Gecko) Version/7.1.0.7 Safari/534.11";
        wrapper = shallowMount(UserDeviceInfo, {
            localVue,
            router,
            propsData: { user_agent: user_agent }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Render Check', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
});



describe('User Device Info - Case3 (No User Agent)', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: UserDeviceInfo }
            ]
        })
        router.push(`/orders/list/`);
        const user_agent = undefined;
        wrapper = shallowMount(UserDeviceInfo, {
            localVue,
            router,
            propsData: { user_agent: user_agent }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Render Check', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
});

describe('User Device Info - Case4 (Faulty User Agent)', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: UserDeviceInfo }
            ]
        })
        router.push(`/orders/list/`);
        const user_agent = "true";
        wrapper = shallowMount(UserDeviceInfo, {
            localVue,
            router,
            propsData: { user_agent: user_agent }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('No Render Check', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(false)
    });
});