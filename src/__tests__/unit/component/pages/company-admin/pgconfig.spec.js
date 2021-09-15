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
let res3 = {"status":true,"data":[[{"payment_gateway":"payubiz","is_active":true,"comments":"","id":51,"app_id":"000000000000000000000001","reviewer":"omanshlavania@gofynd.com","collect_by":"fynd","refund_by":"fynd","api_key":"lu7Y7O","is_reviewed":false,"merchant_profile_id":null}],{}]}

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
    localVue.use(VueRouter);
    mock.reset();
    router = new VueRouter({
      AdminRoutes
    });
    router.push('/administrator/company-details/1/application/000000000000000000000001?status=true');
  });

  it('Get pg detail page info. successfully', async () => {
    mock.onGet(URLS.FETCH_REVIEW_LIST(JSON.stringify({ companyId: '1', app_id: '000000000000000000000001' }), "true")).reply(
      200,
      response
    );

    mock.onGet(URLS.FETCH_COD_CONFIG(JSON.stringify({ companyId: '1', app_id: '000000000000000000000001' }))).reply(
      200,
      res2
    );

    mock.onPost(URLS.PG_REVIEWED(JSON.stringify({ companyId: '1', app_id: '000000000000000000000001' }), dataraw )).reply(200, res3);



    wrapper = mount(PgConfig, {
      localVue,
      router
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.exists()).toBeTruthy();
    
    const div = wrapper.find('div');
    expect(div.exists()).toBe(true);
    mock.reset();

    //company_reject_dialog

    //         await flushPromises();
    //         const button = wrapper.find({ ref: 'company_reject_dialog' })
    // expect(button.exists()).toBe(true)
    // const backBtn = wrapper.find('.page-nav-back-text');
    // expect(backBtn.exists()).toBe(true);
    // backBtn.trigger('click');
    // await wrapper.vm.$nextTick();
    // await flushPromises();
    //     expect(router.currentRoute.fullPath).toBe(
    //         $router.go(-1)
    //     );
    //mock.reset();

  });





});
