import { mount, createLocalVue } from "@vue/test-utils";
import EditAttributes from "../../../../../../pages/product/attributes/edit.vue";
import URLS from "../../../../../../services/domain.service.js"

import mocks from "./mocks";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
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
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/attributes/edit/:slug', component: EditAttributes }]
        })
        router.push('/administrator/product/attributes/edit/size-of-helmet');
        mock.onGet(URLS.FETCH_ATTRIBUTE() + "size-of-helmet").reply(200, mocks.attributeResponse);
        mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
        mock.onGet(URLS.UNITS()).reply(200, mocks.unitsResponse);

        const wrapper = mount(EditAttributes, {
            localVue,
            router
        })
        expect(wrapper.element).toMatchSnapshot();
    });
    it('error response', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/attributes/edit/:slug', component: EditAttributes }]
        })
        router.push('/administrator/product/attributes/edit/size-of-helmet');
        mock.onGet(URLS.FETCH_ATTRIBUTE() + "size-of-helmet").reply(500, { data: "erro" });
        mock.onGet(URLS.DEPARTMENT()).reply(500, { data: "error" });
        mock.onGet(URLS.UNITS()).reply(500, { data: "error" });

        const wrapper = mount(EditAttributes, {
            localVue,
            router
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.pageError).toBe(true);
    });
    it('verify functions', async (done) => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/attributes/edit/:slug', component: EditAttributes }]
        })
        router.push('/administrator/product/attributes/edit/size-of-helmet');
        mock.onGet(URLS.FETCH_ATTRIBUTE() + "size-of-helmet").reply(200, mocks.attributeResponse);
        mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
        mock.onGet(URLS.UNITS()).reply(200, mocks.unitsResponse);
        mock.onPut().reply(200);
        mock.onPost().reply(200);

        const wrapper = mount(EditAttributes, {
            localVue,
            router
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.element).toMatchSnapshot();
        wrapper.vm.saveForm();
        wrapper.vm.setUnitsList({ text: "milli" })
        expect(wrapper.vm.getFormData().details.displayType).toBe('text');
        wrapper.vm.$set(wrapper.vm, 'attrType', 'html');
        expect(wrapper.vm.getFormData().details.displayType).toBe('html');
        wrapper.vm.$set(wrapper.vm, 'attrType', 'test');
        expect(wrapper.vm.getFormData().schema.type).toBe('test');
        expect(wrapper.vm.getFormData().details.displayType).toBe('text');
        await wrapper.vm.saveForm();
        expect(wrapper.vm.inProgress).toBe(true);
        done();
    });

})
