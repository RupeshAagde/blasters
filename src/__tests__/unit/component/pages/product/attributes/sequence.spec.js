import { mount, createLocalVue } from "@vue/test-utils";
import SequenceComponent from "../../../../../../pages/product/attributes/sequence.vue";
import URLS from "../../../../../../services/domain.service"

import mocks from "./mocks";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import { setTimeout } from "window-or-global";
const mock = new MockAdapter(axios);

let localVue = createLocalVue()
localVue.use(VueRouter)

describe('Create/Edit Attribute Page', () => {
	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(VueRouter);
		mock.reset();
	});
	it('success',async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/attributes/sequence/filters', component: SequenceComponent }]
		})
		router.push('/administrator/product/attributes/sequence/filters');
		mock.onGet(URLS.ATTRIBUTE_SHUFFLE('filters')).reply(200, mocks.attributeShuffleResponse);

		const wrapper = mount(SequenceComponent, {
			localVue,
			router
		})
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.element).toMatchSnapshot();
		wrapper.vm.shuffleAttributes();
		expect(wrapper.vm.pageError).toBe(false);
	});
	it('error response ',async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/attributes/sequence/filters', component: SequenceComponent }]
		})
		router.push('/administrator/product/attributes/sequence/filters');
		mock.onGet(URLS.ATTRIBUTE_SHUFFLE('filters')).reply(500, {data: "error"});
		mock.onGet(URLS.FETCH_ATTRIBUTE()).reply(500, {data: "error"});
		const wrapper = mount(SequenceComponent, {
			localVue,
			router
		})
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.pageLoading).toBe(false);
	});
})
