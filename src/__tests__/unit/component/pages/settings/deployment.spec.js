import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import Deployment from "./../../../../../pages/settings/deployment.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/custom-deployment-mapping.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router;

describe('Mounted Deployment Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.GET_DEPLOYMENT_MAPPING()).reply(200, MOCK_DATA);
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/deployment',
                component: Deployment
            }]
        })
        router.push('/administrator/settings/deployment');
        wrapper = mount(Deployment, {
            localVue,
            router,
        })
        await flushPromises();
    });

    it('Wrapper and container to exist', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })

    it('Navigate custom deployment page ', async () => {
        const addCustomDeploymentBtn = wrapper.find('.n-flat-button-secondary');
        expect(addCustomDeploymentBtn.exists()).toBe(true);
        addCustomDeploymentBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(router.currentRoute.fullPath).toBe(
            `/administrator/settings/deployments/create`
        );
    })

})