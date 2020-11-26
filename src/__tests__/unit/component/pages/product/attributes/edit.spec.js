import {mount, createLocalVue} from "@vue/test-utils";
import EditAttributes from "../../../../../../pages/product/attributes/edit.vue";
import URLS from  "../../../../../../services/domain.service.js"

import mocks from "./mocks";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import { console } from "window-or-global";


const mock = new MockAdapter(axios);

let localVue = createLocalVue()
localVue.use(VueRouter)

describe('Create/Edit Attribute Page', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    });
    it('should render to a snapshot', () => {
        const router = new VueRouter({routes: [
            { path: '/administrator/product/attributes/edit/:slug', component: EditAttributes }]})
		router.push('/administrator/product/attributes/edit/size-of-helmet');
		mock.onGet(URLS.FETCH_ATTRIBUTE()+"size-of-helmet").reply(200, mocks.attributeResponse);
		mock.onGet(URLS.DEPARTMENT()).reply(200, {data:mocks.departments});
		mock.onGet(URLS.UNITS()).reply(200, {data:mocks.unitsResponse});

        const wrapper = mount(EditAttributes, {
            localVue,
            router
        })
		expect(wrapper.element).toMatchSnapshot();
	});
	it('should render to a snapshot', () => {
        const router = new VueRouter({routes: [
            { path: '/administrator/product/attributes/edit/:slug', component: EditAttributes }]})
		router.push('/administrator/product/attributes/edit/size-of-helmet');
		mock.onGet(URLS.FETCH_ATTRIBUTE()+"size-of-helmet").reply(200, mocks.attributeResponse);
		mock.onGet(URLS.DEPARTMENT()).reply(200, {data:mocks.departments});
		mock.onGet(URLS.UNITS()).reply(200, {data:mocks.unitsResponse});

        const wrapper = mount(EditAttributes, {
            localVue,
            router
        })
		expect(wrapper.element).toMatchSnapshot();
		wrapper.vm.saveForm();
		console.log(wrapper.vm.attribute)
	});
})
