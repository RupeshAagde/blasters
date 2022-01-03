import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import CreateDeployment from "./../../../../../pages/settings/create_deployment.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA_COMPANY from "./fixtures/custom-deployment-company-list.json";
import MOCK_DATA_DEPLOYMENT from "./fixtures/custom-deployment-list.json";
import MOCK_DATA_DEPLOYMENT_POST from "./fixtures/custom-deployment-post.json";
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
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, MOCK_DATA_COMPANY);
        mock.onGet(URLS.GET_DEPLOYMENT_LIST()).reply(200, MOCK_DATA_DEPLOYMENT);
        mock.onPost(URLS.CREATE_NEW_DEPLOYMENT_MAPPING()).reply(200, MOCK_DATA_DEPLOYMENT_POST);
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/deployment/create',
                component: CreateDeployment
            }]
        })
        router.push('/administrator/settings/deployment/create');
        wrapper = mount(CreateDeployment, {
            localVue,
            router,
        })
        await flushPromises();
    });

    it('Wrapper and container to exist', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Add custom deployment ', async () => {


        // wrapper.vm.$set(wrapper.vm, 'selectedCompany', 'Robotron');
        // wrapper.vm.$set(wrapper.vm, 'selectedDeployment', 'fplt-jetfire-basic-0-rsrvr-dply');

        // const addCustomDeploymentBtn = wrapper.find('.n-flat-button-secondary');
        // expect(addCustomDeploymentBtn.exists()).toBe(true);
        // addCustomDeploymentBtn.vm.$emit('click');

        // let showSuccessMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
        // let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        // await wrapper.vm.$nextTick();
        // await flushPromises();
        // expect(showSuccessMethod).toHaveBeenCalled();
        // await wrapper.vm.$nextTick();
        // await flushPromises();
        // expect(router.currentRoute.fullPath).toBe(
        //     `/administrator/settings/deployments`
        // );
    });

})