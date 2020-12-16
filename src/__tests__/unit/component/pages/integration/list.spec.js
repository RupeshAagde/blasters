import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import IntegrationList from "./../../../../../pages/integration/list.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/list-mock.json";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

describe('Mounted List Integration Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.INTEGRATIONS_LIST()).reply(200, MOCK_DATA);
        router = new VueRouter({
            routes: [{
                path: '/administrator/integrations/list',
                component: IntegrationList
            }]
        })
        router.push('/administrator/integrations/list');
        wrapper = mount(IntegrationList, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
    });
    it('exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot()
    })
    it('list data', async () => {
        expect(wrapper.vm.integrationsList.length).toBe(10)
    })
    it('pagination data', async () => {
        wrapper.vm.paginationChange({current: 2, limit: 10})
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.integrationsList.length).toBe(10);
    })
    it('add integartion', async () => {
        wrapper.vm.addIntegration()
        expect(router.currentRoute.path).toBe(`/administrator/integration/create`);
    })
    it('edit integartion', async () => {
        wrapper.vm.editIntegration({_id:'5e5608bf4265cf7198d1e58f'})
        expect(router.currentRoute.path).toBe(`/administrator/integration/edit/5e5608bf4265cf7198d1e58f`);
    })

})