import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Rma from '../../../../../pages/rma/index.vue';
import AdmPageHeader from '../../../../../components/common/layout/page-header.vue';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';

const mock = new MockAdapter(axios);
let localVue, router, wrapper;

let destroyComponent = jest.fn();
let init = jest.fn();

describe('RMA Global Setup Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/orders/rma/rules/global',
                    name: 'rma-global-rules',
                    component: Rma
                },
            ]
        });
    });

    it('mount RMA', async () => {
        router.push('/administrator/orders/rma/rules/global');

        wrapper = mount(Rma, {
            localVue,
            router
        });

        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapper.exists()).toBeTruthy();
        const container = wrapper.find('.panel');
        expect(container.exists()).toBe(true);
    });

    it('test back click', async () => {
        const pageHeader = wrapper.findComponent(AdmPageHeader)
        const backFn = jest.spyOn(wrapper.vm.$router, 'push')
        pageHeader.vm.$emit('backClick');
        expect(backFn).toHaveBeenCalled()
    });

    it('test back click default', async () => {
        router.push('/administrator/orders/rma/rules/global/setup');
        const pageHeader = wrapper.findComponent(AdmPageHeader)
        const backFn = jest.spyOn(wrapper.vm.$router, 'push')
        pageHeader.vm.$emit('backClick');
        expect(backFn).toHaveBeenCalled()
    });
});
