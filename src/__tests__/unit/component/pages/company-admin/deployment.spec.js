import {
    shallowMount,
    createLocalVue
} from "@vue/test-utils";
import Deployment from "../../../../../pages/company-admin/deployment-listing.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/custom-deployment-mapping.json";
import MOCK_DATA_DEPL from "./fixtures/custom-deployment-list.json";

import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router;

describe('Mounted Deployment Page', () => {
    beforeEach(async () => {
        mock.onGet(URLS.GET_DEPLOYMENT_MAPPING()).reply(200, MOCK_DATA);
        mock.onGet(URLS.GET_DEPLOYMENT_LIST()).reply(200, MOCK_DATA_DEPL);
        wrapper = shallowMount(Deployment);
    });

    it('Wrapper and container to exist', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })

    it('Open assign deployment modal ', async () => {
        const addCustomDeploymentBtn =  wrapper.find('.assignment-btn');
        expect(addCustomDeploymentBtn.exists()).toBe(true);
        addCustomDeploymentBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await flushPromises();
        const assignmentForm = wrapper.find('.create-deployment-form');
        expect(assignmentForm.exists()).toBe(true);
    })

})