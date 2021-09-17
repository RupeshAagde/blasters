'use strict';
import { mount, createLocalVue } from '@vue/test-utils';
import PgConfig from '../../../../../pages/company-admin/pgconfig.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from './fixtures/cbs-mock.json';
import AdminRoutes from '@/router/administrator/index.js';
import URLS from '../../../../../services/domain.service.js';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);


let response = { "status": true, "data": [[{ "payment_gateway": "payumoney", "is_active": true, "comments": "", "id": 45, "app_id": "000000000000000000000001", "reviewer": "omanshlavania@gofynd.com", "collect_by": "fynd", "refund_by": "fynd", "api_key": "EPbQ3UMB", "is_reviewed": false, "merchant_profile_id": null }, { "payment_gateway": "payubiz", "is_active": true, "comments": "", "id": 51, "app_id": "000000000000000000000001", "reviewer": "omanshlavania@gofynd.com", "collect_by": "fynd", "refund_by": "fynd", "api_key": "lu7Y7O", "is_reviewed": false, "merchant_profile_id": null }], {}] }

let res2 = { "success": true, "id": 1, "app_id": "000000000000000000000001", "delivery_config": { "cod": { "refund_by": "self", "collect_by": "fynd" } } }
let res3 = { "status": true, "data": [[{ "payment_gateway": "payubiz", "is_active": true, "comments": "", "id": 51, "app_id": "000000000000000000000001", "reviewer": "omanshlavania@gofynd.com", "collect_by": "fynd", "refund_by": "fynd", "api_key": "lu7Y7O", "is_reviewed": false, "merchant_profile_id": null }], {}] }

let dataraw = {
  "payment_gateway": "razorpay",
  "is_reviewed": true,
  "reviewer": "vikaskumar@gofynd.com",
  "comments": "live",
  "is_active": true,
  "is_sub_fynd_account": false,
  "password": "unicron@admin@fynd#2021"
}
describe('Mounted PG review component ', () => {
  beforeEach(() => {
    localVue = createLocalVue();
    mock.reset();
  });

  it('Get pg detail page info. successfully', async () => {
    mock.onGet(URLS.FETCH_REVIEW_LIST({ companyId: '1', app_id: '000000000000000000000001' }, "true")).reply(
      200,
      response
    );
    wrapper = mount(PgConfig, {
      localVue,
      mocks: {
				$route: {
					params: {
            companyId: "1",
            appId: "000000000000000000000001"
          },
          query:{
            status:"true"
          }
				}
			}
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.exists()).toBeTruthy();
    const coddiv = wrapper.find('#cod')
    expect(coddiv.exists()).toBe(true);
    // coddiv.trigger('click')
    const div = wrapper.find('div');
    expect(div.exists()).toBe(true);
    mock.reset();
  });





});
