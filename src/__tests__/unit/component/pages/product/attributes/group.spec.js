import { mount, createLocalVue } from "@vue/test-utils";
import GroupComponent from "../../../../../../pages/product/attributes/group.vue";
import URLS from "../../../../../../services/domain.service.js"

import mocks from "./mocks";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)

describe.skip('Create/Edit Groups', () => {
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(VueRouter);
    mock.reset();
  });
  it('should render to a snapshot', async () => {
    // const router = new VueRouter({
    //   routes: [
    //     { path: '/administrator/product/attributes/group/details/:entity', component: GroupComponent }
    //   ]
    // })
    // router.push('/administrator/product/attributes/group/details/phone_hardware_storage');
    // mock.onGet(URLS.ATTRIBUTE_GROUPS_SHUFFLE('details')).reply(200, mocks.attributeShuffleGroupResponse);
    // mock.onGet(URLS.DEPARTMENT()).reply(200, {data:mocks.departments});
    // mock.onGet(URLS.FETCH_ATTRIBUTE(), {params: { limit: 999999, ca: true }}).reply(200, mocks.attributeResponse).onAny().reply(
    //   200,mocks.attributeResponse
    // );
    // mock.onGet(URLS.ATTRIBUTE_GROUPS("phone-hardware-storage"), {params: {type:'details', ca:true}}).reply(200, mocks.attributeGroupResponse);

    // mock.onGet(URLS.ATTRIBUTE_GROUPS_SHUFFLE("phone-hardware-storage")).reply(200, mocks.attributeShuffleGroupResponse);

    // // mock.onGet().reply(500);
    // const wrapper = mount(GroupComponent, {
    //   localVue,
    //   router
    // })
    // await new Promise(resolve => setTimeout(resolve, 10));
    // expect(wrapper.element).toMatchSnapshot();
    // expect(typeof GroupComponent.data).toBe('function');
  });
});
