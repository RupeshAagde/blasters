import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Rules from '../../../../../pages/rma/rules.vue';
import SearchContainer from '../../../../../components/packaging/common/search-container.vue';
import AdmNoContent from '../../../../../components/common/adm-no-content.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
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

describe('Mounted Rules Component', () => {
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
                    component: Rules
                }
            ]
        });
        router.push('/administrator/rma/rules');

        wrapper = mount(Rules, {
            localVue,
            router
        });

        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapper.exists()).toBeTruthy();
        const container = wrapper.find('.main-container');
        expect(container.exists()).toBe(true);
        expect(wrapper.element).toMatchSnapshot();
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Search Rules', async () => {
        let searchContainer = wrapper.findComponent(SearchContainer);
        let searchInput = wrapper.find('#rma-platform-search')
        expect(searchContainer.exists()).toBe(true);
        await searchInput.setValue('some value')
        await new Promise((resolve) => setTimeout(resolve, 600));
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(wrapper.vm.optInSearchValue).toBe('some value')
    });

    it('should check for search handleChange', () => {
        wrapper.vm.searchPlatforms('test input');
        sleep(1000).then(() => {
            expect(wrapper.vm.optInSearchValue).toBe('test input');
            expect(wrapper.vm.fetchOptedSalesChannels).toHaveBeenCalled();
        });
    });

    it('No content', async () => {
        let NoContent = wrapper.findComponent(AdmNoContent);
        expect(NoContent.exists()).toBe(false);
    });

    it('Pagination', () => {
        wrapper.vm.paginationChange({ current: 2, limit: 10 });
        expect(wrapper.vm.pageObject).toStrictEqual({
            current: 2,
            limit: 10,
            total: 534
        });
    });

    it('click go back', async () => {
        let redirectFunction = jest.spyOn(wrapper.vm, "redirectToGlobalRuleList");
        let GoButton = wrapper.findAllComponents(NitrozenButton);
        GoButton = GoButton.at(0);
        await GoButton.trigger('click');
        sleep(1000).then(() => {
            expect(redirectFunction).toHaveBeenCalled();
        });
    });
});
