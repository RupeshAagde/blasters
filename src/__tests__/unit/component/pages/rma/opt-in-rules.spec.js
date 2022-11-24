import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import OptInRules from '../../../../../pages/rma/opt-in-rules.vue';
import URLS from '../../../../../services/domain.service.js';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import rulesMock from './fixtures/rules.json';

const mock = new MockAdapter(axios);
let localVue, router, wrapper;

const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const getItem = jest
.spyOn(Storage.prototype, 'getItem')

describe('Mounted OptInRules Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.GET_OPTED_RMA_SALES_CHANNEL()).reply(200, rulesMock);
    });

    it('list - should exist wrapper and div', async () => {
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/rma/rules',
                    name: 'rma-rules',
                    component: OptInRules
                }
            ]
        });
        router.push('/administrator/rma/rules');

        wrapper = mount(OptInRules, {
            localVue,
            router,
            propsData: {
                tableData: rulesMock.items
            }
        });

        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapper.exists()).toBeTruthy();
        const container = wrapper.find('.rules-history-table-container');
        expect(container.exists()).toBe(true);
        expect(wrapper.element).toMatchSnapshot();
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('click a rule', async () => {
        let redirectFunction = jest.spyOn(wrapper.vm, "redirectToPlatformDetails");
        let card = wrapper.find('.card-wrapper');
        await card.trigger('click');
        sleep(1000).then(() => {
            expect(redirectFunction).toHaveBeenCalled();
        });
    });
});
